"use client";

import { IconAddToHomeScreen, IconIOSPlus, IconIOSShare, IconMoreOver } from "#src/icons/AddToHomeScreen";

export function InstallPrompt() {
  return (
    <div className="space-y-10">
      <h2>Install App to enable push messages</h2>

      <div>
        <h3>On android</h3>
        <span className="flex flex-wrap gap-2">
          <span>Click options</span>
          <div className="border">
            <IconMoreOver className="fill-color-neutral-900" />
          </div>
          <span>and then</span>
          <div className="flex gap-1 border">
            <IconAddToHomeScreen className="fill-color-neutral-900 text-color-unthemed-neutral-50" />
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
            <span>Add to Home Screen</span>
          </span>
        </div>
      </div>
    </div>
  );
}
