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
//import { ButtonRemoveUserFromPack } from "./button-remove-user-from-pack";
import { PrettyDate, PrettyDateLong } from "#src/components/PrettyDate";

import { UserImage32x32 } from "#src/components/user/UserImage";
import { NotSignedInPage } from "#src/app/settings/NotSignedInPage";
//import { NotPackMemberPage } from "./not-pack-member-page";
import { PendingPackMemberPage } from "../pending-pack-member-page";
import { PackAddMembers } from "../pack-add-members";
import { NotPackMemberPage } from "../not-pack-member-page";
import { ButtonRemoveUserFromPack } from "../button-remove-user-from-pack";
import { Fragment } from "react";
import { FormEditPack } from "./form-edit-pack";

//import { CreateCommentForm } from "./CreateCommentForm";
//import { CommentsList, PinnedComment } from "./CommentsList";
//import { UserImage32x32 } from "#src/components/user/UserImage";

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
        <FormEditPack initialPack={pack} />
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
    </Shell>
  );
}

function showRemove(myRole: "ADMIN" | "CREATOR" | "MEMBER" | undefined, otherRole: "ADMIN" | "CREATOR" | "MEMBER") {
  if (myRole === "CREATOR" && otherRole !== "CREATOR") return true;
  if (myRole === "ADMIN" && otherRole === "MEMBER") return true;
  return false;
}
