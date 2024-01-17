"use client";

import { type RouterOutputs } from "#src/hooks/api";
import { useImageUpload } from "#src/hooks/useImageUpload";
import { cn } from "#src/utils/cn";
import { useState } from "react";

type Props = {
  className?: string;
  event: RouterOutputs["event"]["getById"];
};

export function EventImage({ event, className }: Props) {
  const image = useState();
  const { isUploading, uploadFile } = useImageUpload(event.id, { onSuccess: (s) => console.log(s) });
  return <div className={cn("", className)}></div>;
}
