import { create } from "zustand";
import { createSelectors } from "./create-selectors";

import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createUserSlice, type Userlice } from "./slices/user";
import { createMapSlice, type MapSlice } from "./slices/map";
import { portalstuffSlice, type PortastuffSlice } from "./slices/portalstuff";

type StoreState = DialogSlice & Userlice & MapSlice & PortastuffSlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createDialogSlice(...a),
  ...createUserSlice(...a),
  ...createMapSlice(...a),
  ...portalstuffSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);

export const setPortalstuffElement = (el: HTMLDivElement) => {
  useStore.setState({ portalstuffElement: el });
};
