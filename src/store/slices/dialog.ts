import type { StateCreator } from "zustand";
import { useStore } from "..";

type Type = "show" | "hide" | "toggle";
type Name = "profilebutton" | "notifications" | "warning";
type Value = "none" | Name;
type Action = { type: Type; name: Name };

export type DialogSlice = {
  dialogValue: Value;
  dialogAction: (action: Action) => void;
};

export const createDialogSlice: StateCreator<DialogSlice, [], [], DialogSlice> = (set, _get) => ({
  dialogValue: "none",
  dialogAction: (action) =>
    set((state) => {
      if (action.type === "show" || (action.type === "toggle" && action.name !== state.dialogValue)) {
        return { dialogValue: action.name };
      } else {
        return { dialogValue: "none" };
      }
    }),
});

export function dialogAction(action: { type: Type; name: Name }) {
  useStore.setState((prev) => {
    if (action.type === "show" || (action.type === "toggle" && action.name !== prev.dialogValue)) {
      return { dialogValue: action.name };
    } else {
      return { dialogValue: "none" };
    }
  });
}
