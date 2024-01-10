import type { StateCreator } from "zustand";
import { TokenUserSchema, type TokenUser } from "#src/utils/jwt/schema";
import { JSONE } from "#src/utils/jsone";

export type Userlice = {
  user: TokenUser | null;
  userGetSession: () => Promise<void>;
};

export const createUserSlice: StateCreator<Userlice, [], [], Userlice> = (set, _get) => ({
  user: null,
  userGetSession: async () => {
    const user = await getSession();
    if (user) {
      set({ user });
    }
  },
});

/**
 * grab a session, if user already signed in then return user instead
 *
 * the user in this state is only for basic ui elements purposes like id, name and image
 */
async function getSession() {
  try {
    const res = await fetch("/api/session");
    if (res.status === 200) {
      const user = TokenUserSchema.parse(await JSONE.parse(await res.text()));
      return user;
    } else {
      return null;
    }
  } catch (error) {
    //console.log(error);
    return null;
  }
}
