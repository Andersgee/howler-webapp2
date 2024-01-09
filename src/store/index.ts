import { create } from "zustand";
import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createUserSlice, type Userlice } from "./slices/user";
import { createSelectors } from "./create-selectors";

type StoreState = DialogSlice & Userlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createDialogSlice(...a),
  ...createUserSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);
