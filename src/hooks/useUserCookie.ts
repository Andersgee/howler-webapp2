import { api } from "./api";

export function useUserCookie() {
  const { data: user } = api.user.cookie.useQuery();
  return { isSignedIn: user === undefined ? undefined : !!user, userCookie: user };
}
