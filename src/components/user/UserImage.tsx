import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";
/*
import { api } from "#src/hooks/api";

export function UserImage32x32ById({ userId }: { userId: bigint }) {
  const { data: user } = api.user.infoPublic.useQuery({ userId });
  return (
    <div className="relative h-8 w-8 shrink-0">
      {user?.image && (
        <Image
          alt={user.name}
          src={user.image}
          sizes={imageSizes("w-8")}
          fill
          className="rounded-full object-contain shadow-inner shadow-color-neutral-800"
        />
      )}
    </div>
  );
}
*/
export function UserImage32x32({ image, alt }: { image?: string | null; alt: string }) {
  return (
    <div className="relative h-8 w-8 shrink-0">
      {image && (
        <Image
          alt={alt}
          src={image}
          sizes={imageSizes("w-8")}
          fill
          className="rounded-full object-contain shadow-inner shadow-color-neutral-800"
        />
      )}
    </div>
  );
}

export function UserImage96x96({ image, alt }: { image?: string | null; alt: string }) {
  return (
    <div className="relative h-24 w-24 shrink-0">
      {image && (
        <Image
          alt={alt}
          src={image}
          sizes={imageSizes("w-24")}
          fill
          className="rounded-full object-contain shadow-inner shadow-color-neutral-800"
        />
      )}
    </div>
  );
}
