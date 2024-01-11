import { apiRscPublic } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (!id) {
    notFound();
  }

  const { api } = apiRscPublic();
  const event = await api.event.getById({ id });

  return (
    <div>
      <h1>{event.title}</h1>
      <pre>{JSONE.stringify(event, 2)}</pre>
    </div>
  );
}
