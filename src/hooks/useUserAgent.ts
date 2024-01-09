import { useEffect, useState } from "react";

export function useUserAgent() {
  const [browserInfo, setBrowserInfo] = useState({ userAgent: "unkown", isConsideredSafeForOauth: true });

  useEffect(() => {
    if ("userAgent" in navigator) {
      const ua = navigator.userAgent;
      if (ua.match(/FBAN|FBAV/i)) {
        // Facebook in-app browser detected
        setBrowserInfo({ userAgent: ua, isConsideredSafeForOauth: false });
      } else {
        //setBrowserInfo({ userAgent: ua, isConsideredSafeForOauth: true });
      }
    }
  }, []);

  return browserInfo;
}
