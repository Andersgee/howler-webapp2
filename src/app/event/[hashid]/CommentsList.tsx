"use client";

import { cn } from "#src/utils/cn";

type Props = {
  eventId: bigint;
  className?: string;
};

export function CommentsList({ className }: Props) {
  return <div className={cn("", className)}>CommentsList</div>;
}
