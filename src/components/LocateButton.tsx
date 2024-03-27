import { IconLocate } from "#src/icons/Locate";
import { Button } from "#src/ui/button";
import { useToast } from "#src/ui/use-toast";

type Props = {
  className?: string;
  onLocated: (pos: { lng: number; lat: number }) => void;
};

export function LocateButton({ className, onLocated }: Props) {
  const { toast } = useToast();
  return (
    <Button
      variant="icon"
      aria-label="locate"
      className={className}
      onClick={() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (p) => onLocated({ lat: p.coords.latitude, lng: p.coords.longitude }),
            () =>
              toast({
                variant: "default",
                title: "Accessing location is blocked.",
                description:
                  "Open your browser preferences or click the lock near the address bar to allow access to your location.",
              })
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
      <IconLocate />
    </Button>
  );
}
