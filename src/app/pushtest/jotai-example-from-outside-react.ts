import { jotaiStore } from "#src/store/jotai";
import { atomCount } from "#src/store/jotai/atoms/atom-count";

export function decrCount() {
  jotaiStore.set(atomCount, (prev) => prev - 1);
  //jotaiStore.set(atomCount, (prev) => prev + 1); // Update atom's value
  //jotaiStore.get(atomCount); // Read atom's value
}
