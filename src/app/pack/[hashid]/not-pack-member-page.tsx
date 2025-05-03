import { cn } from "#src/utils/cn";
import { ButtonRequestPackMembership } from "./button-request-pack-membership";

type Props = {
  className?: string;
  packId: bigint;
};

export function NotPackMemberPage({ className, packId }: Props) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="px-2">
        <section className="flex flex-col items-center">
          <h1 className="mt-2">You are not in this pack yet.</h1>
          <ButtonRequestPackMembership packId={packId} />
        </section>
      </div>
    </div>
  );
}
