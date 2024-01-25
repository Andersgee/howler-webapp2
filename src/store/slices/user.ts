import { type StateCreator } from "zustand";
import { type TokenUser } from "#src/utils/jwt/schema";
//import { useStore } from "..";

export type Userlice = {
  user: TokenUser | null;
  userDispatch: (user: TokenUser) => void;
};

export const createUserSlice: StateCreator<Userlice, [], [], Userlice> = (set, _get) => ({
  user: null,
  userDispatch: (user) => set({ user }),
});

//export function userDispatch(user: TokenUser) {
//  console.log("setting store user");
//  useStore.setState({ user });
//}
