"use client";

import { api, type RouterOutputs } from "#src/hooks/api";
import { JSONE } from "#src/utils/jsone";
import { useState } from "react";

type Props = {
  data: RouterOutputs["event"]["getById"];
};

export function Hmm2({ data }: Props) {
  const [d, setD] = useState(new Date());
  const [r, setR] = useState(BigInt("7"));
  const [a, setA] = useState(false);
  const q = api.event.getByIdNumber.useQuery({ id: 2, k: d, r });
  return (
    <div>
      <div>HMM2:</div>
      <button
        onClick={() => {
          console.log("hello", a);
          setA((prev) => !prev);
        }}
      >
        button
      </button>
      <pre>{JSONE.stringify(q.data, 2)}</pre>
    </div>
  );
}
