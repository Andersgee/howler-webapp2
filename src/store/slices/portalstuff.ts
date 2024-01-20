import type { StateCreator } from "zustand";
import { useStore } from "..";

export type PortastuffSlice = {
  portalstuffElement: HTMLDivElement | null;
};

export const portalstuffSlice: StateCreator<PortastuffSlice, [], [], PortastuffSlice> = (set, _get) => ({
  portalstuffElement: null,
});

export function setPortalstuffElement(el: HTMLDivElement) {
  useStore.setState({ portalstuffElement: el });
}
