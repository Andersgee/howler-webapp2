import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { SignJWT } from "jose";
import { vapidImportPrivateKey } from "#src/lib/vapid-keys";

export async function webPush(endpoint: string, body: string) {
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY_B64URL;
  const PRIVATE_KEY = await vapidImportPrivateKey(process.env.VAPID_PRIVATE_KEY_B64URL);

  const jwt = await new SignJWT({
    exp: oneHourFromNowSeconds(),
    sub: "mailto:andersgee@gmail.com", //required
    aud: "http://localhost:3000", //required
    //body,
  })
    .setProtectedHeader({ alg: "ES256" })
    .sign(PRIVATE_KEY);

  return await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `vapid t=${jwt},k=${PUBLIC_KEY}` },
    body,
  });
}

//debug with this
function oneHourFromNowSeconds() {
  //spec said this must be
  const ONE_HOUR_IN_SECONDS = 60 * 60;
  const d = new Date();
  const exp = Math.floor(d.getTime() / 1000);
  return exp + ONE_HOUR_IN_SECONDS;
}

//the required "exp" claim MUST NOT be more than 24 hours from the time of the request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function expSeconds() {
  const TWENTY_THREE_HOURS_IN_SECONDS = 60 * 60 * 23;
  const d = new Date();
  const exp = Math.floor(d.getTime() / 1000);
  return exp + TWENTY_THREE_HOURS_IN_SECONDS;
}
