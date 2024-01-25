import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { imageSizes } from "#src/utils/image-sizes";

import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page() {
  const { api } = await apiRsc();
  const id = idFromHashid("o0o5W")!;
  const event = await api.event.getById({ id });
  if (!event?.image) notFound();
  //const image = "https://storage.googleapis.com/howler-event-images/o0o5W-f8b0caeb-115b-4730-9297-e695da2035e6";

  const image_blurdata =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nGNoLk5av2TK/59PGUK9bBITnS7uWMxQkx3Ly8EwpTyZITXMXUFarCLOBwBpHQ9k5wYp+gAAAABJRU5ErkJggg==";

  return (
    <div>
      <h1>testing bluradata </h1>
      <div className="flex gap-2">
        <div>
          <p>basic</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image_blurdata} alt="Red dot" className="h-auto w-64 md:w-96" />
        </div>
        <div>
          <p>Image with blur</p>
          <Image
            src={event.image}
            alt={"some title"}
            sizes={imageSizes("w-64", { md: "w-96" })}
            className="mb-8 h-auto w-64 md:w-96"
            //width and height only for aspect ratio purpose
            width={256}
            height={Math.round(256 / event.imageAspect)}
            placeholder="blur"
            blurDataURL={image_blurdata}
          />
        </div>
        <div>
          <p>Image without blur</p>
          <Image
            src={event.image}
            alt={"some title"}
            sizes={imageSizes("w-64", { md: "w-96" })}
            className="mb-8 h-auto w-64 md:w-96"
            //width and height only for aspect ratio purpose
            width={256}
            height={Math.round(256 / event.imageAspect)}
          />
        </div>
      </div>
    </div>
  );
}
