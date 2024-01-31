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
      const fileSize = file.size;
      if (fileSize > 10000000) {
        options?.onError?.("Only images smaller than 10MB please.");
        return;
      }

      setIsUploading(true);
      try {
        const { imageAspect, width, height } = await getImageSize(file);
        let imageUrl: string;
        //if (fileSize < 4000000) {
        if (false) {
          //payload to serverless functions must be less than 4.5MB
          //there are some benefits to going via api.
          // - a single request from client
          // - allows optimizing before storing in bucket
          // - allows generating placeholder data
          imageUrl = await uploadSmall(
            eventId,
            file,
            width,
            height,
            30000,
            () => setUploadTimerIsReached(true),
            abortController
          );
        } else {
          //the standard is having user upload directly to bucket
          //3 requests from client.. get signed url from api, upload image to bucket, tell api that transfer is complete and update db
          //cant really optimize image or generate placeholder data until some time later this way
          //I mean images are ofc optimized and cached via next/image when used,
          //Im talking about optimizing/saving on storage space here and also a smaller "original" also meaning the very first next/image usage will also be faster
          //
          //the proper way would be to have some google cloud hook that listens for bucket inserts (object finalized) and then sends some info to my api
          //https://cloud.google.com/functions/docs/tutorials/storage#functions-prepare-environment-nodejs
          //but ofc this will not work on localhost unless running through some tunneling service like ngrok
          imageUrl = await uploadLarge(
            eventId,
            file,
            width,
            height,
            30000,
            () => setUploadTimerIsReached(true),
            abortController
          );
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

async function uploadLarge(
  eventId: bigint,
  file: File,
  width: number,
  height: number,
  uploadTimerMs = 30000,
  timerCallback: () => void,
  abortController: AbortController
) {
  const imageAspect = width / height;
  //get signed
  const url = `/api/gcs?eventId=${eventId}&contentType=${file.type}`;
  const { signedUploadUrl, imageUrl } = z
    .object({ signedUploadUrl: z.string(), imageUrl: z.string() })
    .parse(await fetch(url, { method: "GET" }).then((res) => res.json()));

  //upload to bucket, headers must match bucket config
  const timer = setTimeout(timerCallback, uploadTimerMs);
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
  return imageUrl;
}

async function uploadSmall(
  eventId: bigint,
  file: File,
  width: number,
  height: number,
  uploadTimerMs = 30000,
  timerCallback: () => void,
  abortController: AbortController
) {
  const fileBuffer = await file.arrayBuffer();
  const url = `/api/gcs/image?${encodeParams({
    eventId: eventId.toString(),
    contentType: file.type,
    w: width,
    h: height,
  })}`;
  const timer = setTimeout(timerCallback, uploadTimerMs);
  const imageUrl = await fetch(url, {
    method: "POST",
    signal: abortController.signal,
    body: fileBuffer,
  }).then((res) => res.text());
  clearTimeout(timer);

  return imageUrl;
}

async function getImageSize(file: File): Promise<{ width: number; height: number; imageAspect: number }> {
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
