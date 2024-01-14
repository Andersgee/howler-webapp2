import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs } from "#src/hooks/api";
import { IconWhat, IconWhere, IconWhen, IconWho } from "#src/icons";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  event: RouterOutputs["event"]["getById"];
};

export function Eventinfo({ event, className }: Props) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2">
        <IconWhat />
        <div className="w-11 shrink-0">What</div>
        <h1 className="m-0 capitalize-first">{event.title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <IconWhere />
        <div className="w-11 shrink-0">Where</div>
        <div className="capitalize-first">{event.locationName ?? "anywhere"}</div>
      </div>
      <div className="flex items-center gap-2">
        <IconWhen />
        <div className="w-11 shrink-0">When</div>
        <div>
          <PrettyDate date={event.date} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconWho />
        <div className="w-11 shrink-0">Who</div>
        <div>anyone</div>
      </div>
    </div>
  );
}