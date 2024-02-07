"use client";

import { Button } from "#src/ui/button";
import { ToastAction } from "#src/ui/toast";
import { useToast } from "#src/ui/use-toast";

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div>
      <Button
        onClick={() => {
          toast({
            variant: "default",
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }}
      >
        Default toast
      </Button>
      <Button
        onClick={() => {
          toast({
            variant: "default",
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  console.log("tried again");
                }}
              >
                Try again
              </ToastAction>
            ),
          });
        }}
      >
        Default toast with action
      </Button>
      <Button
        onClick={() => {
          toast({
            variant: "warn",
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }}
      >
        warn toast
      </Button>
      <Button
        onClick={() => {
          toast({
            variant: "warn",
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  console.log("tried again");
                }}
              >
                Try again
              </ToastAction>
            ),
          });
        }}
      >
        warn toast with action
      </Button>
    </div>
  );
}
