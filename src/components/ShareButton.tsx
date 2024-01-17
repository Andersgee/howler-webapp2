"use client";

import { absUrl } from "#src/utils/url";
import { usePathname } from "next/navigation";
import { useToast } from "#src/ui/use-toast";
import { Share } from "#src/icons";
import { Button } from "#src/ui/button";

type Props = {
  title: string;
  className?: string;
};

export function ShareButton({ className, title }: Props) {
  const { toast } = useToast();
  const pathName = usePathname();
  return (
    <Button
      variant="icon"
      className={className}
      onClick={async () => {
        const url = absUrl(pathName);

        try {
          if ("share" in navigator) {
            await navigator.share({
              title: title,
              url: url,
            });
          } else {
            //just copy link if native sharing not available
            const ok = await copyToClipboard(url);
            if (ok) {
              toast({
                variant: "default",
                title: "Link copied",
                description: "url copied to clipboard.",
              });
            }
          }
        } catch {
          toast({
            variant: "warn",
            title: "Could not share.",
            description: "You can copy paste the url from adress bar instead.",
          });
          //ignore
        }
      }}
    >
      <Share className="mr-0" /> Share
    </Button>
  );
}

async function copyToClipboard(text: string) {
  if (!("clipboard" in navigator)) return false;

  return await navigator.clipboard.writeText(text).then(
    () => true,
    () => false
  );
}
