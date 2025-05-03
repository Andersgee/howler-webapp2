import { type RouterOutputs } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { ButtonJoinPack, ButtonRequestPackMembership } from "./button-join-pack";

type Props = {
  className?: string;
  pack: NonNullable<RouterOutputs["pack"]["getById"]>;
};

export function NotPackMemberPage({ className, pack }: Props) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="px-2">
        <section className="flex flex-col items-center">
          <h1 className="mt-2">You are not in pack {pack.title} yet.</h1>
          {pack.inviteSetting === "PUBLIC" ? (
            <ButtonJoinPack packId={pack.id} />
          ) : (
            <ButtonRequestPackMembership packId={pack.id} />
          )}
          <p></p>
        </section>
      </div>
    </div>
  );
}
