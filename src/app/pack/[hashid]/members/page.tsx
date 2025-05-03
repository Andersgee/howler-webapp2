import { apiRsc } from "#src/trpc/api-rsc";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";
import Link from "next/link";
import { Shell } from "#src/components/Shell";
import { PrettyDate } from "#src/components/PrettyDate";
import { UserImage32x32 } from "#src/components/user/UserImage";
import { NotSignedInPage } from "#src/app/settings/NotSignedInPage";
import { PendingPackMemberPage } from "../pending-pack-member-page";
import { PackAddMembers } from "../pack-add-members";
import { NotPackMemberPage } from "../not-pack-member-page";
import { ButtonRemoveUserFromPack } from "../button-remove-user-from-pack";
import { Fragment } from "react";
import { ButtonApproveMembershipRequest } from "./button-approve-pending";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api, user } = await apiRsc();
  const pack = await api.pack.getById({ id });
  if (!pack) notFound();

  if (!user) {
    return <NotSignedInPage />;
  }

  const { members, myMemberShip } = await api.pack.members({ id });

  if (!myMemberShip) {
    return <NotPackMemberPage pack={pack} />;
  }
  if (myMemberShip.pending) {
    return <PendingPackMemberPage myMemberShip={myMemberShip} packTitle={pack.title} />;
  }

  return (
    <Shell>
      <div className="py-4">
        <PackAddMembers packId={pack.id} />
      </div>
      {pack.image ? (
        <div className="flex justify-center">
          <Image
            priority
            src={pack.image}
            alt={pack.title}
            sizes={imageSizes("w-64", { md: "w-96" })}
            className="mb-8 h-auto w-64 md:w-96"
            //width and height only for aspect ratio purpose
            width={256}
            height={Math.round(256 / pack.imageAspect)}
            //placeholder={pack.imageBlurData ? "blur" : undefined}
            //blurDataURL={pack.imageBlurData ? blurDataURLstring(event.imageBlurData) : undefined}
          />
        </div>
      ) : (
        <div className="py-4"></div>
      )}
      <div className="grid grid-cols-3 items-center gap-2">
        <div>user</div>
        <div>role</div>
        {/* 
        <div>joindate</div>
 */}
        <div></div>
        {members.map((member) => (
          <Fragment key={member.userId}>
            <Link prefetch={false} className="flex gap-2" href={`/profile/${hashidFromId(member.userId)}`}>
              <UserImage32x32 image={member.userImage} alt={member.userName} />
              {member.userName}
            </Link>

            <div>{member.packRole}</div>
            {/* 
            <div className="truncate">
              <PrettyDate date={member.addedToPackAt} />
            </div>
             */}
            <div>
              {member.pending ? (
                <ButtonApproveMembershipRequest packId={pack.id} userId={member.userId} />
              ) : showRemove(myMemberShip?.packRole, member.packRole) ? (
                <ButtonRemoveUserFromPack packId={member.packId} userId={member.userId} />
              ) : (
                <div></div>
              )}
            </div>
          </Fragment>
        ))}
      </div>
      {/* 
      <div className="py-8">
        <h2>Members</h2>
        {members.map((member) => (
          <div key={member.userId} className="flex items-center gap-2">
            <Link prefetch={false} className="flex items-center gap-2" href={`/profile/${hashidFromId(member.userId)}`}>
              <UserImage32x32 image={member.userImage} alt={member.userName} />
              {member.userName}
            </Link>
            {showRemove(myMemberShip?.packRole, member.packRole) && (
              <ButtonRemoveUserFromPack packId={member.packId} userId={member.userId} />
            )}
          </div>
        ))}
      </div>
       */}
    </Shell>
  );
}

function showRemove(myRole: "ADMIN" | "CREATOR" | "MEMBER" | undefined, otherRole: "ADMIN" | "CREATOR" | "MEMBER") {
  if (myRole === "CREATOR" && otherRole !== "CREATOR") return true;
  if (myRole === "ADMIN" && otherRole === "MEMBER") return true;
  return false;
}
