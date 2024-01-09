import { api } from "#src/hooks/api";
import { imageSizes } from "#src/utils/image-sizes";
import Image from "next/image";

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

export function UserImage32x32({ image, alt }: { image?: string; alt: string }) {
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
