import { useEffect, useRef } from "react";
import { JSONE } from "#src/utils/jsone";
import { TokenUserSchema } from "#src/utils/jwt/schema";
import { useStore } from "#src/store";
//import { userDispatch } from "#src/store/slices/user";

export function useGetSession() {
  const didRun = useRef(false);
  const userDispatch = useStore.use.userDispatch();

  useEffect(() => {
    if (didRun.current) return; //only run once even in development
    getSession()
      .then((user) => {
        if (user) {
          userDispatch(user);
          //userDispatch(user) //this might cause ReferenceError: cannot access 'i' before initialization?
        }
      })
      .catch(() => {
        //ignore
      });
    didRun.current = true;
  }, [userDispatch]);
  return null;
}

/**
 * grab session cookie and maybe user cookie
 *
 * if user already signed in (status 200) then set store.user aswell
 *
 * see /api/session logic
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
  } catch (err) {
    console.log(err);
    return null;
  }
}
