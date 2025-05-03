import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { idFromHashid } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { notFound } from "next/navigation";
import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { Shell } from "#src/components/Shell";
import { hashidFromId } from "#src/utils/hashid";
import { UserImage96x96 } from "#src/components/user/UserImage";
import { buttonVariants } from "#src/ui/button";
import { NotSignedInPage } from "#src/app/settings/NotSignedInPage";

type Props = {
  children: React.ReactNode;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export async function generateMetadata({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api } = apiRscPublic();
  const pack = await api.pack.getById({ id });
  if (!pack) notFound();

  return seo({
    title: `${pack.title} | Howler`,
    titleTemplate: `%s | ${pack.title} | Howler`,
    description: `Pack ${pack.title}`,
    url: `/pack/${params.hashid}`,
    //image: `/event/${params.hashid}/image.png`,
  });
}

export default async function Layout({ children, params }: Props) {
  const hashid = params.hashid;
  const id = idFromHashid(hashid);
  if (id === undefined) notFound();

  const { api, user } = await apiRsc();
  if (!user) {
    return <NotSignedInPage />;
  }
  const pack = await api.pack.getById({ id });
  if (!pack) notFound();

  const userinfo = await api.user.info({ userId: user.id });

  return (
    <Shell>
      <section className="mt-8 flex flex-col items-center">
        {/* 
        <p className="pb-4">
          your howler id: <span className="font-bold">{hashidFromId(user.id)}</span>
        </p>
 */}

        {pack.image && <UserImage96x96 alt={userinfo.name} image={pack.image} />}

        <h1 className="mt-2">{pack.title}</h1>
        {/* 
        <p>{pack.desciption}</p>
         */}
      </section>

      <hr className="py-2" />

      {/* <Nav /> */}

      <div className="flex justify-center gap-2">
        <Link href={`/pack/${hashid}`} className={buttonVariants({ variant: "outline" })}>
          Activity
        </Link>
        <Link href={`/pack/${hashid}/members`} className={buttonVariants({ variant: "outline" })}>
          Members
        </Link>
        <Link href={`/pack/${hashid}/edit`} className={buttonVariants({ variant: "outline" })}>
          Settings
        </Link>
      </div>
      <hr className="py-2" />

      {children}
    </Shell>
  );
}
