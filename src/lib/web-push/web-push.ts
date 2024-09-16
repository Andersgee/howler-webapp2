import { SignJWT } from "jose";
import { vapidImportPrivateKey } from "#src/lib/vapid-keys";

//spec: https://datatracker.ietf.org/doc/rfc8292/
//payload encryption: https://www.rfc-editor.org/rfc/rfc8291.txt
//the encryption thing was interesting but prob just use "npm install http_ece"

//also good info here: https://www.rfc-editor.org/rfc/rfc8030

type Urgency = "very-low" | "low" | "normal" | "high";

// time to live in seconds that push service should retain message
//const TTL = 2419200; //this is what "web-push" package uses as default
const TTL = 60;
const URGENCY: Urgency = "normal";

export async function webPush(endpoint: string, body: string) {
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY_B64URL;
  const PRIVATE_KEY = await vapidImportPrivateKey(process.env.VAPID_PRIVATE_KEY_B64URL);

  const aud = new URL(endpoint).origin;
  const jwt = await new SignJWT({
    exp: oneHourFromNowSeconds(),
    sub: process.env.VAPID_SUB, //required
    //aud: process.env.NEXT_PUBLIC_ABSURL, //required
    //aud: "https://updates.push.services.mozilla.com", //hmm
    aud,
  })
    .setProtectedHeader({ alg: "ES256" })
    .sign(PRIVATE_KEY);

  return await fetch(endpoint, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Authorization": `vapid t=${jwt},k=${PUBLIC_KEY}`,
      "TTL": `${TTL}`,
      "Urgency": `${URGENCY}`,
      "Content-Encoding": "aes128gcm",
    },
    body, //TODO: this should be encryoted... with aes128gcm apparently?
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
