import { create } from "zustand";
import { createSelectors } from "./create-selectors";

import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createUserSlice, type Userlice } from "./slices/user";
import { createMapSlice, type MapSlice } from "./slices/map";
import { createNotificationSlice, type NotificationSlice } from "./slices/notification";

type StoreState = DialogSlice & Userlice & MapSlice & NotificationSlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createDialogSlice(...a),
  ...createUserSlice(...a),
  ...createMapSlice(...a),
  ...createNotificationSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);
