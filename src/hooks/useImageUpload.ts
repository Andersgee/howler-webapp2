"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import { JSONE } from "#src/utils/jsone";
import { errorMessageFromUnkown } from "#src/utils/errormessage";
import { encodeParams } from "#src/utils/url";

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
  uploadTimerMs?: number;
};

export function useImageUpload(eventId: bigint, options?: Options) {
  const [isUploading, setIsUploading] = useState(false);
  const [abortController] = useState(() => new AbortController());

  const [uploadTimerIsReached, setUploadTimerIsReached] = useState(false);

  const cancelUpload = useCallback(() => {
    abortController.abort("user-cancelled");
    setUploadTimerIsReached(false);
  }, [abortController]);

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
        const { imageAspect } = await getImageAspectRatio(file);

        //get signed
        const url = `/api/gcs?eventId=${eventId}&contentType=${file.type}`;
        const { signedUploadUrl, imageUrl } = z
          .object({ signedUploadUrl: z.string(), imageUrl: z.string() })
          .parse(await fetch(url, { method: "GET" }).then((res) => res.json()));

        //upload to bucket, headers must match bucket config
        const timer = setTimeout(() => setUploadTimerIsReached(true), options?.uploadTimerMs ?? 30000);
        const bucketres = await fetch(signedUploadUrl, {
          method: "PUT",
          signal: abortController.signal,
          headers: {
            "Content-Type": file.type,
            "Cache-Control": "public, max-age=2592000",
            "X-Goog-Content-Length-Range": "0,10000000",
          },
          body: file,
        });
        clearTimeout(timer);
        setUploadTimerIsReached(false);
        if (!bucketres.ok) {
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
        setIsUploading(false);
      } catch (err) {
        const msg = errorMessageFromUnkown(err);
        if (msg === "user-cancelled") {
          //expected, user clicked cancel
        } else {
          options?.onError?.("Something went wrong.");
        }
        setIsUploading(false);
      }
    },
    [eventId, options, abortController]
  );

  return { uploadFile, isUploading, cancelUpload, uploadTimerIsReached };
}

/**
 * same thing but go via api route to optimize image before storing in bucket
 *
 * This only works for images smaller than 4.5MB if hosting on vercel.
 */
export function useImageOptimizedUpload(eventId: bigint, options?: Options) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!(file.type === "image/png" || file.type === "image/jpeg")) {
        options?.onError?.("Only jpeg or png images please.");
        return;
      }
      if (file.size > 4000000) {
        options?.onError?.("Only images smaller than 4MB please.");
        return;
      }

      setIsUploading(true);
      try {
        const { imageAspect, width, height } = await getImageAspectRatio(file);

        const fileBuffer = await file.arrayBuffer();
        const url = `/api/gcs/image?${encodeParams({
          eventId: eventId.toString(),
          contentType: file.type,
          w: width,
          h: height,
        })}`;
        const imageUrl = await fetch(url, { method: "POST", body: fileBuffer }).then((res) => res.text());

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

async function getImageAspectRatio(file: File): Promise<{ width: number; height: number; imageAspect: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const data = { width: img.width, height: img.height, imageAspect: img.width / img.height };
      URL.revokeObjectURL(img.src);
      resolve(data);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
