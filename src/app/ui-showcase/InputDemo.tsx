"use client";

import { Input } from "#src/ui/input";

export function InputDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Input type="text" placeholder="Say hello..." />
      <Input type="text" disabled placeholder="Say hello..." />

      <Input type="password" placeholder="password..." />
      <Input type="password" disabled placeholder="password..." />
    </div>
  );
}
