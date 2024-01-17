"use client";

import { useCallback, useState } from "react";
import { api } from "#src/hooks/api";

/*
1. check file type and size
2. get signed url
3. PUT it to bucket
4. return image url
*/

const MAX_SIZE_BYTES = 10000000;

type Input = {
  eventId: bigint;
};

type Options = {
  onSuccess?: ({ imageUrl, aspectRatio }: { imageUrl: string; aspectRatio: number }) => void;
  onError?: (msg: string) => void;
};

export function useImageUpload(input: Input, options?: Options) {
  const { mutateAsync: getSignedUrl } = api.gcs.signedUrl.useMutation();
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
      const gcs = await getSignedUrl({ eventId: input.eventId, contentType: file.type });
      if (!gcs) {
        options?.onError?.("Something went wrong. Try again.");
        return;
      }

      let aspectRatio = 1;
      try {
        aspectRatio = await getImageAspectRatio(file);
      } catch {
        console.log("using default image aspectRatio of 1.");
      }

      try {
        const res = await fetch(gcs.signedUploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Cache-Control": "public, max-age=2592000",
            "X-Goog-Content-Length-Range": "0,10000000",
          },
          body: file,
        });
        if (res.ok) {
          options?.onSuccess?.({ imageUrl: gcs.imageUrl, aspectRatio });
        } else {
          options?.onError?.("Something went wrong. Try again.");
        }
      } catch (error) {
        console.log(error);
      }

      setIsUploading(false);
    },
    [input, options, getSignedUrl]
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
