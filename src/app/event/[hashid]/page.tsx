import { ChevronLeft, IconWhat, IconWhen, IconWhere, IconWho } from "#src/icons";
import { apiRscPublic } from "#src/trpc/api-rsc";
import { Button, buttonVariants } from "#src/ui/button";
import { idFromHashid, idFromHashidOrThrow } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapButton } from "./MapButton";
import { PrettyDate } from "#src/components/PrettyDate";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (!id) notFound();

  const { api } = apiRscPublic();
  const event = await api.event.getById({ id });

  return (
    <div>
      {/*
      <div>
        <Link href="/event" className={buttonVariants({ variant: "outline", className: "w-fit" })}>
          <ChevronLeft /> Back
        </Link>
      </div>
  */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <IconWhat />
          <div className="w-11 shrink-0">What</div>
          <h1 className="capitalize-first m-0">{event.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <IconWhere />
          <div className="w-11 shrink-0">Where</div>
          <div className="capitalize-first">{event.locationName ?? "anywhere"}</div>
        </div>
        <div className="flex items-center gap-2">
          <IconWhen />
          <div className="w-11 shrink-0">When</div>
          <div>
            <PrettyDate date={event.date} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconWho />
          <div className="w-11 shrink-0">Who</div>
          <div>anyone</div>
        </div>
      </div>
      <div>{event.location && <MapButton location={event.location} locationName={event.locationName} />}</div>
    </div>
  );
}
