"use client";

import { prettyDate, prettyDateLong } from "#src/utils/date";
import { useEffect, useState } from "react";

type Props = {
  date: Date;
};

/**
 * without hydration mismatch, by editing string on mount
 *
 * return string, example: "Wednesday, July 5, 2023 at 13:17"
 */
export function PrettyDateLong({ date }: Props) {
  const [str, setStr] = useState(() => prettyDateLong(date, false));
  useEffect(() => {
    setStr(prettyDateLong(date, true));
  }, [date]);

  return str;
}

/**
 * without hydration mismatch, by editing string on mount
 *
 * returns string, example: "Jul 5, 2023, 13:17"
 */
export function PrettyDate({ date }: Props) {
  const [str, setStr] = useState(() => prettyDate(date, false));
  useEffect(() => {
    setStr(prettyDate(date, true));
  }, [date]);

  return str;
}
