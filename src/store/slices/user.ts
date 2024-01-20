import { type StateCreator } from "zustand";
import { type TokenUser } from "#src/utils/jwt/schema";

export type Userlice = {
  user: TokenUser | null;
};

export const createUserSlice: StateCreator<Userlice, [], [], Userlice> = (_set, _get) => ({
  user: null,
});
