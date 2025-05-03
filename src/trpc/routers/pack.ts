import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { notify } from "#src/lib/cloud-messaging-light/notify";
import { hashidFromId } from "#src/utils/hashid";
import { afterResponseIsFinished } from "#src/utils/after-response-is-finished";
import { TRPCError } from "@trpc/server";
import { tagsPack } from "./packTags";
import { revalidateTag } from "next/cache";
import { type NotNull, sql } from "kysely";

export const packRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ input }) => {
    //return await dbfetch({ next: { tags: [tagsEvent.info(input.id)] } })
    const db = dbfetch({ next: { tags: [tagsPack.info(input.id)] } });
    const pack = await db
      .selectFrom("Pack")
      .where("Pack.id", "=", input.id)
      //.innerJoin("User", "User.id", "Pack.creatorId")
      .selectAll("Pack")
      //.select(["User.name as creatorName", "User.image as creatorImage"])
      //.selectAll("Event")
      //.select(["User.image as creatorImage", "User.name as creatorName"])
      //.select()
      //.where("Event.id", "=", input.id)
      .executeTakeFirst();

    return pack;
  }),

  members: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ ctx, input }) => {
    const db = dbfetch({ next: { tags: [tagsPack.info(input.id)] } });

    const members = await db
      .selectFrom("UserPackPivot")
      .where("packId", "=", input.id)
      .innerJoin("User", "User.id", "UserPackPivot.userId")
      .select([
        "UserPackPivot.role as packRole",
        "UserPackPivot.packId",
        "User.id as userId",
        "User.name as userName",
        "User.image as userImage",
        "UserPackPivot.createdAt as addedToPackAt",
        "UserPackPivot.pending",
      ])
      .orderBy("UserPackPivot.createdAt asc")
      .execute();

    const myMemberShip = members.find((x) => x.userId === ctx.user?.id);

    return { members, myMemberShip };
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        //image: z.string().nullish(),
        //creatorId: z.bigint(),
        inviteSetting: z.enum(["PUBLIC", "MEMBERS_AND_ABOVE", "ADMINS_AND_ABOVE", "CREATOR_ONLY"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();

      const insertResult = await db.insertInto("Pack").values(input).executeTakeFirstOrThrow();

      await db
        .insertInto("UserPackPivot")
        .ignore()
        .values({
          packId: insertResult.insertId!,
          userId: ctx.user.id,
          role: "CREATOR",
        })
        .execute();

      const hashid = hashidFromId(insertResult.insertId!);

      //afterResponseIsFinished(async () => {
      //  await notify([input.userId], {
      //    title: `${ctx.user.name} added you to pack ${pack.title}`,
      //    body: `see your packs`,
      //    relativeLink: `/profile/${hashidFromId(ctx.user.id)}`,
      //    icon: pack.image ?? ctx.user.image,
      //  });
      //});

      return { ...insertResult, hashid };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
        title: z.string().optional(),
        //image: z.string().nullish(),
        inviteSetting: z.enum(["PUBLIC", "MEMBERS_AND_ABOVE", "ADMINS_AND_ABOVE", "CREATOR_ONLY"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();

      //only for ADMINS / CREATOR
      await db
        .selectFrom("UserPackPivot")
        .where("packId", "=", input.id)
        .where("userId", "=", ctx.user.id)
        .where((eb) => eb.or([eb("role", "=", "CREATOR"), eb("role", "=", "ADMIN")]))
        .select("packId")
        .executeTakeFirstOrThrow();

      await db.updateTable("Pack").set(input).where("id", "=", input.id).execute();

      const tag = tagsPack.info(input.id);
      revalidateTag(tag);

      return { tag };
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    const db = dbfetch();
    const packs = await db
      .selectFrom("UserPackPivot")
      //.where("userId", "=", ctx.user.id)
      .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
      .selectAll()
      .select(({ eb }) => [
        eb
          .selectFrom("UserPackPivot")
          .whereRef("Pack.id", "=", "UserPackPivot.packId")
          .select(sql<number>`COUNT(*)`.as("count"))
          .as("memberCount"),
      ])
      .execute();

    return packs;
  }),

  listMy: protectedProcedure.query(async ({ ctx }) => {
    const db = dbfetch();
    const packs = await db
      .selectFrom("UserPackPivot")
      .where("userId", "=", ctx.user.id)
      .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
      .selectAll()
      .select(({ eb }) => [
        eb
          .selectFrom("UserPackPivot")
          .whereRef("Pack.id", "=", "UserPackPivot.packId")
          .select(sql<number>`COUNT(*)`.as("count"))
          .as("memberCount"),
      ])
      .$narrowType<{ memberCount: NotNull }>() //for typescript
      .execute();

    return packs;
  }),

  addUser: protectedProcedure
    .input(
      z.object({
        userId: z.bigint(),
        packId: z.bigint(),
        role: z.enum(["ADMIN", "CREATOR", "MEMBER"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();
      const tag = tagsPack.info(input.packId);

      const pack = await db
        .selectFrom("UserPackPivot")
        .where("packId", "=", input.packId)
        .where("userId", "=", ctx.user.id)
        //comment out. allow any member (regardless of role) to add users
        //.where((eb) => eb.or([eb("role", "=", "CREATOR"), eb("role", "=", "ADMIN"), eb("role", "=", "MEMBER")]))
        .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
        .selectAll("Pack")
        .select("UserPackPivot.role as userPackRole")
        .executeTakeFirstOrThrow();

      const canAcceptRequest =
        pack.inviteSetting === "PUBLIC" ||
        (pack.inviteSetting === "CREATOR_ONLY" && pack.userPackRole === "CREATOR") ||
        (pack.inviteSetting === "ADMINS_AND_ABOVE" &&
          (pack.userPackRole === "CREATOR" || pack.userPackRole === "ADMIN"));

      if (!canAcceptRequest) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const insertResult = await db.insertInto("UserPackPivot").ignore().values(input).executeTakeFirstOrThrow();

      if (insertResult.numInsertedOrUpdatedRows) {
        afterResponseIsFinished(async () => {
          await notify([input.userId], {
            title: `${ctx.user.name} added you to pack ${pack.title}`,
            body: `See your pack ${pack.title}`,
            relativeLink: `/pack/${hashidFromId(ctx.user.id)}`,
            icon: ctx.user.image,
            image: pack.image ?? undefined,
          });
        });

        revalidateTag(tag);

        return { action: "ADDED", tag };
      } else {
        //this either could be
        // 1. trying to add a user again
        // 2. the pivot already existed (a pending join request)
        // so might aswell allow approving via addUser route
        const updateResult = await db
          .updateTable("UserPackPivot")
          .set({ pending: false })
          .where("packId", "=", input.packId)
          .where("userId", "=", input.userId)
          .where("pending", "=", true)
          .executeTakeFirst();

        revalidateTag(tag);

        if (updateResult.numUpdatedRows) {
          return { action: "APPROVED", tag };
        }

        return { action: "IGNORED", tag };
      }
    }),

  removeUser: protectedProcedure
    .input(z.object({ packId: z.bigint(), userId: z.bigint() }))
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();
      const tag = tagsPack.info(input.packId);

      const pack = await db
        .selectFrom("UserPackPivot")
        .where("packId", "=", input.packId)
        .where("userId", "=", ctx.user.id)
        //only allow creator or admin roles to remove users
        //.where((eb) => eb.or([eb("role", "=", "CREATOR"), eb("role", "=", "ADMIN")]))
        .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
        .selectAll()
        .executeTakeFirstOrThrow();

      let query = db.deleteFrom("UserPackPivot").where("packId", "=", input.packId).where("userId", "=", input.userId);

      //only allow removing people with lower role than yourself so for example a 'member' (lowest) cant remove people at all
      if (pack.role === "MEMBER") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      } else if (pack.role === "ADMIN") {
        query = query.where("role", "=", "MEMBER");
      } else if (pack.role === "CREATOR") {
        query = query.where((eb) => eb.or([eb("role", "=", "ADMIN"), eb("role", "=", "MEMBER")]));
      }

      const _deleteResult = await query.executeTakeFirstOrThrow();

      revalidateTag(tag);

      return { tag };
    }),

  requestMembership: protectedProcedure.input(z.object({ packId: z.bigint() })).mutation(async ({ ctx, input }) => {
    const db = dbfetch();
    const tag = tagsPack.info(input.packId);

    const pack = await db
      .selectFrom("Pack")
      .where("id", "=", input.packId)
      .select(["id", "title", "inviteSetting"])
      .executeTakeFirstOrThrow();

    if (pack.inviteSetting === "PUBLIC") {
      //anyone can straight up join
      await db
        .insertInto("UserPackPivot")
        .values({
          packId: input.packId,
          userId: ctx.user.id,
        })
        .execute();

      //notify every single member except the one we just added?
      const members = await db
        .selectFrom("UserPackPivot")
        .where("packId", "=", input.packId)
        .select("userId")
        .execute();
      const notifyIds = members.map((x) => x.userId).filter((id) => id !== ctx.user.id);
      afterResponseIsFinished(async () => {
        await notify(notifyIds, {
          title: `${ctx.user.name} just joined pack ${pack.title}`,
          body: `See your pack ${pack.title}`,
          relativeLink: `/pack/${hashidFromId(pack.id)}`,
          icon: ctx.user.image,
        });
      });

      revalidateTag(tag);
      return { pending: false, tag };
    }

    await db
      .insertInto("UserPackPivot")
      .values({
        packId: input.packId,
        userId: ctx.user.id,
        pending: true,
      })
      .execute();

    //notify all users that could approve them
    let query = db.selectFrom("UserPackPivot").where("packId", "=", input.packId).select("userId");
    if (pack.inviteSetting === "CREATOR_ONLY") {
      query = query.where("role", "=", "CREATOR");
    } else if (pack.inviteSetting === "ADMINS_AND_ABOVE") {
      query = query.where((eb) => eb.or([eb("role", "=", "CREATOR"), eb("role", "=", "ADMIN")]));
    } else {
      //any role
    }
    const usersThatCanApproveMembershipRequest = await query.execute();

    const notifyIds = usersThatCanApproveMembershipRequest.map((x) => x.userId);
    afterResponseIsFinished(async () => {
      await notify(notifyIds, {
        title: `${ctx.user.name} wants to join pack ${pack.title}`,
        body: `Accept or deny their request`,
        relativeLink: `/pack/${hashidFromId(pack.id)}`,
        icon: ctx.user.image,
      });
    });

    revalidateTag(tag);
    return { pending: true, tag };
  }),

  approveMembershipRequest: protectedProcedure
    .input(z.object({ packId: z.bigint(), userId: z.bigint() }))
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();
      const tag = tagsPack.info(input.packId);

      const pack = await db
        .selectFrom("UserPackPivot")
        .where("packId", "=", input.packId)
        .where("userId", "=", ctx.user.id)
        .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
        .select([
          "Pack.id",
          "Pack.title",
          "UserPackPivot.role as userPackRole",
          "Pack.inviteSetting as packInviteSetting",
          "Pack.title as packTitle",
        ])
        .executeTakeFirstOrThrow();

      const canAcceptRequest =
        pack.packInviteSetting === "PUBLIC" ||
        (pack.packInviteSetting === "CREATOR_ONLY" && pack.userPackRole === "CREATOR") ||
        (pack.packInviteSetting === "ADMINS_AND_ABOVE" &&
          (pack.userPackRole === "CREATOR" || pack.userPackRole === "ADMIN"));
      if (canAcceptRequest) {
        await db
          .updateTable("UserPackPivot")
          .set({ pending: false })
          .where("packId", "=", input.packId)
          .where("userId", "=", input.userId)
          .execute();

        const approvedUser = await db
          .selectFrom("User")
          .where("id", "=", input.userId)
          .select(["id", "name", "image"])
          .executeTakeFirstOrThrow();

        const notifyUsers = await db
          .selectFrom("UserPackPivot")
          .where("packId", "=", input.packId)
          .where("userId", "=", ctx.user.id)
          .select("userId")
          .execute();

        const notifyIds = notifyUsers.map((x) => x.userId);
        afterResponseIsFinished(async () => {
          await notify(notifyIds, {
            title: `${approvedUser.name} just joined pack ${pack.title}`,
            body: `Approved by ${ctx.user.name}`,
            relativeLink: `/pack/${hashidFromId(pack.id)}`,
            icon: approvedUser.image ?? undefined,
          });
        });
        revalidateTag(tag);
        return { pending: false, tag };
      }

      return { pending: true, tag };
    }),
});
