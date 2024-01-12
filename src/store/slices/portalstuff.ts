import type { StateCreator } from "zustand";

export type PortastuffSlice = {
  portalstuffElement: HTMLDivElement | null;
  portalstuffSetElement: (el: HTMLDivElement) => void;
};

export const portalstuffSlice: StateCreator<PortastuffSlice, [], [], PortastuffSlice> = (set, _get) => ({
  portalstuffElement: null,
  portalstuffSetElement: (el) => set({ portalstuffElement: el }),
});
