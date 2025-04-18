import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { notify } from "#src/lib/cloud-messaging-light/notify";
import { hashidFromId } from "#src/utils/hashid";
import { afterResponseIsFinished } from "#src/utils/after-response-is-finished";
import { schema_insert_UserPackPivot } from "#src/db/types-zod";
import { TRPCError } from "@trpc/server";
import { tagsPack } from "./packTags";
import { revalidateTag } from "next/cache";
import { sql } from "kysely";

export const packRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ input }) => {
    //return await dbfetch({ next: { tags: [tagsEvent.info(input.id)] } })
    const db = dbfetch({ next: { tags: [tagsPack.info(input.id)] } });
    const pack = await db
      .selectFrom("Pack")
      .where("Pack.id", "=", input.id)
      .innerJoin("User", "User.id", "Pack.creatorId")
      .selectAll("Pack")
      .select(["User.name as creatorName", "User.image as creatorImage"])
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
      ])
      .orderBy("UserPackPivot.createdAt asc")
      .execute();

    const myMemberShip = members.find((x) => x.userId === ctx.user?.id);

    return { members, myMemberShip };
  }),

  create: protectedProcedure
    .input(
      z.object({
        //id: z.bigint().optional(),
        title: z.string(),
        //image: z.string().nullish(),
        //creatorId: z.bigint(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();

      const insertResult = await db
        .insertInto("Pack")
        .values({ ...input, creatorId: ctx.user.id })
        .executeTakeFirstOrThrow();

      await db
        .insertInto("UserPackPivot")
        .ignore()
        .values({
          packId: insertResult.insertId!,
          userId: ctx.user.id,
          role: "CREATOR",
        })
        .execute();

      //afterResponseIsFinished(async () => {
      //  await notify([input.userId], {
      //    title: `${ctx.user.name} added you to pack ${pack.title}`,
      //    body: `see your packs`,
      //    relativeLink: `/profile/${hashidFromId(ctx.user.id)}`,
      //    icon: pack.image ?? ctx.user.image,
      //  });
      //});

      return insertResult;
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
      .execute();

    return packs;
  }),

  addUser: protectedProcedure.input(schema_insert_UserPackPivot).mutation(async ({ ctx, input }) => {
    const db = dbfetch();

    const pack = await db
      .selectFrom("UserPackPivot")
      .where("packId", "=", input.packId)
      .where("userId", "=", ctx.user.id)
      //comment out. allow any member (regardless of role) to add users
      //.where((eb) => eb.or([eb("role", "=", "CREATOR"), eb("role", "=", "ADMIN"), eb("role", "=", "MEMBER")]))
      .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
      .selectAll()
      .executeTakeFirstOrThrow();

    //only allow adding people up to (including) your role
    let cappedRole = input.role;
    if (pack.role === "ADMIN" && input.role === "CREATOR") {
      cappedRole = "ADMIN";
    } else if (pack.role === "MEMBER") {
      cappedRole = "MEMBER";
    }

    const insertResult = await db
      .insertInto("UserPackPivot")
      .ignore()
      .values({
        ...input,
        role: cappedRole,
      })
      .executeTakeFirstOrThrow();

    afterResponseIsFinished(async () => {
      await notify([input.userId], {
        title: `${ctx.user.name} added you to pack ${pack.title}`,
        body: `see your packs`,
        relativeLink: `/profile/${hashidFromId(ctx.user.id)}`,
        icon: pack.image ?? ctx.user.image,
      });
    });

    revalidateTag(tagsPack.info(input.packId));

    return insertResult;
  }),

  removeUser: protectedProcedure
    .input(z.object({ packId: z.bigint(), userId: z.bigint() }))
    .mutation(async ({ ctx, input }) => {
      const db = dbfetch();

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

      const deleteResult = await query.executeTakeFirstOrThrow();

      revalidateTag(tagsPack.info(input.packId));

      return deleteResult;
    }),
});
