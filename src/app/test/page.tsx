/* eslint-disable react/jsx-no-undef */
import { JSONE } from "#src/utils/jsone";
import { apiRscPublic } from "#src/trpc/api-rsc";
import { Hmm } from "./Hmm";
import { Hmm2 } from "./Hmm2";

export default async function Page() {
  const { api } = apiRscPublic();
  const data = await api.event.getById({ id: BigInt(2) });

  return (
    <div>
      <Hmm2 data={data} />
      <Hmm data={data} />
      <pre>{JSONE.stringify(data, 2)}</pre>
    </div>
  );
}
/*
"use client";

import { api } from "#src/hooks/api";

export default function Page() {
  const q = api.event.getById.useQuery({ id: BigInt(2) });
  return <pre>{JSONE.stringify(q.data)}</pre>;
}
*/
