import type { StateCreator } from "zustand";
import { useStore } from "..";

type Name = "profilebutton" | "notifications" | "warning";

export type DialogSlice = {
  dialogValue: Name | "none";
  setDialogValue: (x: Name | "none") => void;
};

export const createDialogSlice: StateCreator<DialogSlice, [], [], DialogSlice> = (set, _get) => ({
  dialogValue: "none",
  setDialogValue: (dialogValue) => set({ dialogValue }),
});

type Action = { type: "show" | "hide" | "toggle"; name: Name };

export function dialogDispatch(action: Action) {
  useStore.setState((prev) => {
    if (action.type === "show" || (action.type === "toggle" && action.name !== prev.dialogValue)) {
      return { dialogValue: action.name };
    } else {
      return { dialogValue: "none" };
    }
  });
}
