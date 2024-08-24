import { IconLocate } from "#src/icons/Locate";
import { IconLoadingSpinner } from "#src/icons/special";
import { Button } from "#src/ui/button";
import { useToast } from "#src/ui/use-toast";
import { useState } from "react";

type Props = {
  className?: string;
  onLocated: (pos: { lng: number; lat: number }) => void;
};

export function LocateButton({ className, onLocated }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      disabled={isLoading}
      variant="icon"
      aria-label="locate"
      className={className}
      onClick={() => {
        if ("geolocation" in navigator) {
          setIsLoading(true);
          navigator.geolocation.getCurrentPosition(
            (p) => {
              setIsLoading(false);
              onLocated({ lat: p.coords.latitude, lng: p.coords.longitude });
            },
            () => {
              setIsLoading(false);
              toast({
                variant: "default",
                title: "Accessing location is blocked.",
                description:
                  "Open your browser preferences or click the lock near the address bar to allow access to your location.",
              });
            }
          );
        } else {
          toast({
            variant: "default",
            title: "Can not locate",
            description: "Browser does not support geolocation.",
          });
        }
      }}
    >
      {isLoading ? <IconLoadingSpinner /> : <IconLocate />}
    </Button>
  );
}
