import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { idFromHashid } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { type ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api } = apiRscPublic();
  const event = await api.event.getById({ id });
  if (!event) notFound();

  return seo({
    title: `${event.title} | Howler`,
    titleTemplate: `%s | ${event.title} | Howler`,
    description: `Howl by ${event.creatorName}`,
    url: `/event/${params.hashid}`,
    image: `/event/${params.hashid}/image.png`,
  });
}

export default function Layout({ children }: Props) {
  return <>{children}</>;
}
