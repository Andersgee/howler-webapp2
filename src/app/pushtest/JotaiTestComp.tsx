"use client";

import { atomCount } from "#src/store/jotai/atoms/atom-count";
import { cn } from "#src/utils/cn";
import { useAtom } from "jotai";
import { decrCount } from "./jotai-example-from-outside-react";

type Props = {
  className?: string;
};

export function JotaiTestComp({ className }: Props) {
  const [count, setCount] = useAtom(atomCount);

  return (
    <div className={cn("", className)}>
      <div>count: {count}</div>
      <button
        className="block"
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        incr
      </button>
      <button
        className="block"
        onClick={() => {
          decrCount();
        }}
      >
        decr from outside react
      </button>
    </div>
  );
}
