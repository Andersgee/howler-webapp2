import { useStore } from "#src/store";
import { useEffect, useRef } from "react";

export function useGetSession() {
  const didRun = useRef(false);
  const userGetSession = useStore.use.userGetSession();

  useEffect(() => {
    if (didRun.current) return; //only run once even in development
    didRun.current = true;
    userGetSession()
      .then(() => void {})
      .catch(() => void {});
  }, [userGetSession]);
  return null;
}
