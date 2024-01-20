import type { StateCreator } from "zustand";
import { useStore } from "..";

type Name = "profilebutton" | "notifications" | "warning";

export type DialogSlice = {
  dialogValue: Name | "none";
};

export const createDialogSlice: StateCreator<DialogSlice, [], [], DialogSlice> = (_set, _get) => ({
  dialogValue: "none",
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
