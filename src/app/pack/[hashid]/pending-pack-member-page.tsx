import { type RouterOutputs } from "#src/hooks/api";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  myMemberShip: NonNullable<RouterOutputs["pack"]["members"]["myMemberShip"]>;
  packTitle: string;
};

export function PendingPackMemberPage({ className, myMemberShip, packTitle }: Props) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="px-2">
        <section className="flex flex-col items-center">
          <h1 className="mt-2">You have requested to join the pack {packTitle}</h1>
          <p>The pack is notified and someone will let you in</p>
          {/* 
          <div>TODO: ButtonCancelJoinRequest</div>
          */}
        </section>
      </div>
    </div>
  );
}
