/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { CombinedDataTransformer } from "@trpc/server";
import { JSONE } from "#src/utils/jsone";

export const trpcTransformer: CombinedDataTransformer = {
  input: {
    serialize: (object) => JSONE.stringify(object),
    deserialize: (object) => JSONE.parse(object),
  },
  output: {
    serialize: (object) => JSONE.stringify(object),
    deserialize: (object) => JSONE.parse(object),
  },
};
