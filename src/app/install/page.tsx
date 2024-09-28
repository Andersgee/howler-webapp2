import { Shell } from "#src/components/Shell";
import { IconAddToHomeScreen, IconIOSPlus, IconIOSShare, IconMoreOver } from "#src/icons/AddToHomeScreen";
import { IconHowler } from "#src/icons/Howler";

export default function Page() {
  return (
    <Shell>
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <IconHowler className="h-12 w-12" />
          <h1 className="text-2xl">Install Howler</h1>
        </div>
        <p className="max-w-md">
          Howler is a webapp, it can behave like a native app, with push notifications and more, without you needing to
          download anything.
        </p>
        <div>
          <h3>On android</h3>
          <span className="flex flex-wrap gap-2">
            <span>Click options</span>
            <div className="border">
              <IconMoreOver className="fill-color-neutral-900" />
            </div>
            <span>and then</span>
            <div className="flex gap-1 border">
              <IconAddToHomeScreen className="fill-color-neutral-900" />
              <span>Add to Home screen</span>
            </div>
          </span>
        </div>
        <div>
          <h3>On iOS</h3>
          <div className="flex flex-wrap gap-2">
            <span>Click share</span>
            <span className="border">
              <IconIOSShare className="fill-color-neutral-900" />
            </span>

            <span>and then</span>
            <span className="flex gap-1 border">
              <IconIOSPlus className="fill-color-neutral-900" />
              <span>Add to Home screen</span>
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
