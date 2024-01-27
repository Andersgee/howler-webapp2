import { create } from "zustand";
import { createSelectors } from "./create-selectors";

import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createUserSlice, type Userlice } from "./slices/user";
import { createMapSlice, type MapSlice } from "./slices/map";
import { createFcmSlice, type Fcmslice } from "./slices/fcm";

type StoreState = DialogSlice & Userlice & MapSlice & Fcmslice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createDialogSlice(...a),
  ...createUserSlice(...a),
  ...createMapSlice(...a),
  ...createFcmSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);
