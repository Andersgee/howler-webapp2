import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { idFromHashid } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { notFound } from "next/navigation";

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

export default function Layout({ children }: Props) {
  return (
    <div>
      <div>pack layout</div>
      {children}
    </div>
  );
}
