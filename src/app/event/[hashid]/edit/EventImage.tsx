"use client";

import { type RouterOutputs } from "#src/hooks/api";
import { useImageUpload } from "#src/hooks/useImageUpload";
import { cn } from "#src/utils/cn";
import { imageSizes } from "#src/utils/image-sizes";
import { useState } from "react";
import Image from "next/image";
import { IconImage } from "#src/icons/Image";
import { IconLoadingSpinner } from "#src/icons/special";
import { useToast } from "#src/ui/use-toast";
import { Button } from "#src/ui/button";

type Props = {
  className?: string;
  event: NonNullable<RouterOutputs["event"]["getById"]>;
};

export function EventImage({ event, className }: Props) {
  const { toast } = useToast();
  const [img, setImg] = useState({ image: event.image, imageAspect: event.imageAspect });
  const { isUploading, uploadFile, uploadTimerIsReached, cancelUpload } = useImageUpload(event.id, {
    onSuccess: (newImg) => setImg(newImg),
    onError: (msg) => toast({ variant: "warn", title: msg }),
    uploadTimerMs: 30000,
  });

  return (
    <div className={cn("max-w-[384px] py-4", className)}>
      {uploadTimerIsReached && (
        <div className="w-64 md:w-96">
          <p className="animate-pulse-tmp">
            upload is taking a while, you might be on a slow connection{" "}
            <Button variant="outline" className="inline-flex" onClick={cancelUpload}>
              cancel
            </Button>
          </p>
        </div>
      )}
      <label
        className={cn(
          "flex h-11 items-center justify-center rounded-md text-sm font-bold outline-none transition-colors focus-visible:focusring disabled:pointer-events-none disabled:opacity-50",
          "border border-color-neutral-300 bg-color-neutral-50 p-[10px] text-color-neutral-900",
          !isUploading && "cursor-pointer hover:bg-color-neutral-200 hover:text-color-neutral-1000",
          "w-64 md:w-96"
        )}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          //capture="environment"
          className="sr-only"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void uploadFile(file);
            }
          }}
        />

        {isUploading ? (
          <>
            <IconLoadingSpinner className="mr-2" /> uploading...
          </>
        ) : (
          <>
            <IconImage className="mr-2" />
            {img.image ? "edit image" : "add image"}
          </>
        )}
      </label>

      {img.image ? (
        <Image
          priority
          src={img.image}
          alt={event.title}
          sizes={imageSizes("w-64", { md: "w-96" })}
          className="mb-8 h-auto w-64 md:w-96"
          //width and height only for aspect ratio purpose
          width={256}
          height={Math.round(256 / img.imageAspect)}
        />
      ) : null}
    </div>
  );
}
