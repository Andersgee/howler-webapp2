"use client";
import { type RouterOutputs } from "#src/hooks/api";
import { JSONE } from "#src/utils/jsone";
import { useState } from "react";

type Props = {
  data: RouterOutputs["event"]["getById"];
};

export function Hmm({ data }: Props) {
  const [a, setA] = useState(false);
  return (
    <div>
      <div>HMM:</div>
      <button
        onClick={() => {
          console.log("hello", a);
          setA((prev) => !prev);
        }}
      >
        button
      </button>
      <pre>{JSONE.stringify(data, 2)}</pre>
    </div>
  );
}
