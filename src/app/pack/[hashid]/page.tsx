import { apiRsc } from "#src/trpc/api-rsc";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
//import { Eventinfo } from "./Eventinfo";
//import { EventActions } from "./EventActions";
import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";
//import { base64 } from "rfc4648";
//import { RichResults } from "./RichResults";
import Link from "next/link";
import { Shell } from "#src/components/Shell";
import { JSONE } from "#src/utils/jsone";
import { ButtonRemoveUserFromPack } from "./button-remove-user-from-pack";
import { PrettyDate, PrettyDateLong } from "#src/components/PrettyDate";
import { Fragment } from "react";
//import { CreateCommentForm } from "./CreateCommentForm";
//import { CommentsList, PinnedComment } from "./CommentsList";
//import { UserImage32x32 } from "#src/components/user/UserImage";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

//function blurDataURLstring(data: Uint8Array) {
//  return `data:image/png;base64,${base64.stringify(data)}`;
//}

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api, user } = await apiRsc();
  const pack = await api.pack.getById({ id });
  if (!pack) notFound();

  const { members, myMemberShip } = await api.pack.members({ id });

  return (
    <Shell>
      <div>pack</div>

      <pre>{JSONE.stringify(pack, 2)}</pre>
      <h2>Members</h2>
      <div className="grid grid-cols-4">
        <div>Name</div>
        <div>Role</div>
        <div>Member since</div>

        <div></div>
        {members.map((member) => (
          <Fragment key={member.userId}>
            <div className="truncate">{member.userName}</div>
            <div>{member.packRole}</div>
            <PrettyDate date={member.addedToPackAt} />
            {showRemove(myMemberShip?.packRole, member.packRole) && (
              <ButtonRemoveUserFromPack packId={member.packId} userId={member.userId} />
            )}
          </Fragment>
        ))}
      </div>

      {/* 
      <pre>{JSONE.stringify(users, 2)}</pre>
 */}
    </Shell>
  );
}

function showRemove(myRole: "ADMIN" | "CREATOR" | "MEMBER" | undefined, otherRole: "ADMIN" | "CREATOR" | "MEMBER") {
  if (myRole === "CREATOR" && otherRole !== "CREATOR") return true;
  if (myRole === "ADMIN" && otherRole === "MEMBER") return true;
  return false;
}
