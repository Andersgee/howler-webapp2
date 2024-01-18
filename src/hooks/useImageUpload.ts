"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import { JSONE } from "#src/utils/jsone";
import { errorMessageFromUnkown } from "#src/utils/errormessage";

/*
1. check file type and size
2. get signed url
3. PUT it to bucket
4. return image url
*/

const MAX_SIZE_BYTES = 10000000;

type Options = {
  onSuccess?: ({ image, imageAspect }: { image: string; imageAspect: number }) => void;
  onError?: (msg: string) => void;
};

export function useImageUpload(eventId: bigint, options?: Options) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!(file.type === "image/png" || file.type === "image/jpeg")) {
        options?.onError?.("Only jpeg or png images please.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        options?.onError?.("Only images smaller than 10MB please.");
        return;
      }

      setIsUploading(true);
      try {
        const imageAspect = await getImageAspectRatio(file);

        //get signed
        const url = `/api/gcs?eventId=${eventId}&contentType=${file.type}`;
        const { signedUploadUrl, imageUrl } = z
          .object({ signedUploadUrl: z.string(), imageUrl: z.string() })
          .parse(await fetch(url, { method: "GET" }).then((res) => res.json()));

        //upload to bucket, headers must match bucket config
        const bucketres = await fetch(signedUploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Cache-Control": "public, max-age=2592000",
            "X-Goog-Content-Length-Range": "0,10000000",
          },
          body: file,
        });
        if (!bucketres) {
          throw new Error("could not upload");
        }

        //update
        const res = await fetch("/api/gcs", {
          method: "POST",
          body: JSONE.stringify({ eventId, imageUrl, imageAspect }),
        });
        if (!res.ok) {
          throw new Error("uploaded but could not update event");
        }

        options?.onSuccess?.({ image: imageUrl, imageAspect });
      } catch (err) {
        console.error(errorMessageFromUnkown(err));
        options?.onError?.("Something went wrong.");
      }
      setIsUploading(false);
    },
    [eventId, options]
  );

  return { uploadFile, isUploading };
}

async function getImageAspectRatio(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      URL.revokeObjectURL(img.src);
      resolve(aspectRatio);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}