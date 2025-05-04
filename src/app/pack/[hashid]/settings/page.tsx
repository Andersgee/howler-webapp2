import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";
import { NotSignedInPage } from "#src/app/settings/NotSignedInPage";
import { PendingPackMemberPage } from "../pending-pack-member-page";
import { NotPackMemberPage } from "../not-pack-member-page";
import { FormEditPack } from "./form-edit-pack";

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
    <div>
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
    </div>
  );
}
