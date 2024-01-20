import { useEffect, useRef } from "react";
import { JSONE } from "#src/utils/jsone";
import { TokenUserSchema } from "#src/utils/jwt/schema";
import { useStore } from "#src/store";

export function useGetSession() {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; //only run once even in development
    didRun.current = true;
    void getSession();
  }, []);
  return null;
}

/**
 * grab/check for session
 *
 * if user already signed in (status 200) then set store.user instead
 *
 * see /api/session logic
 */
export async function getSession() {
  try {
    const res = await fetch("/api/session");
    if (res.status === 200) {
      const user = TokenUserSchema.parse(await JSONE.parse(await res.text()));
      useStore.setState({ user });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
