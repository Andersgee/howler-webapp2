import { create } from "zustand";
import { createSelectors } from "./create-selectors";

import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createUserSlice, type Userlice } from "./slices/user";
import { createMapSlice, type MapSlice } from "./slices/map";

type StoreState = DialogSlice & Userlice & MapSlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createDialogSlice(...a),
  ...createUserSlice(...a),
  ...createMapSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);
