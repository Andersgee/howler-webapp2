"use client";

import { type RouterOutputs } from "#src/hooks/api";
import { useImageUpload } from "#src/hooks/useImageUpload";
import { cn } from "#src/utils/cn";
import { imageSizes } from "#src/utils/image-sizes";
import { useState } from "react";
import Image from "next/image";
import { IconImage } from "#src/icons";
import { IconLoadingSpinner } from "#src/icons/special";
import { useToast } from "#src/ui/use-toast";
import { buttonVariants } from "#src/ui/button";

type Props = {
  className?: string;
  event: RouterOutputs["event"]["getById"];
};

export function EventImage({ event, className }: Props) {
  const { toast } = useToast();
  const [img, setImg] = useState({ image: event.image, imageAspect: event.imageAspect });
  const { isUploading, uploadFile } = useImageUpload(event.id, {
    onSuccess: (newImg) => setImg(newImg),
    onError: (msg) => toast({ variant: "warn", title: msg }),
  });

  return (
    <div className={cn("w-", className)}>
      <label className={buttonVariants({ variant: "outline", className: "block cursor-pointer" })}>
        <input
          type="file"
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
          <IconLoadingSpinner />
        ) : (
          <>
            <IconImage />
            add image
          </>
        )}
      </label>

      {img.image ? (
        <Image
          src={img.image}
          alt={event.title}
          sizes={imageSizes("w-64", { md: "w-96" })}
          className="h-auto w-64 md:w-96"
          //width and height only for aspect ratio purpose
          width={256}
          height={Math.round(256 / img.imageAspect)}
        />
      ) : (
        <div>no image</div>
      )}
    </div>
  );
}
