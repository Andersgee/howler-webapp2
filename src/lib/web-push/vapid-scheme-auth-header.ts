import { SignJWT } from "jose";
import { cryptokey_from_Base64url_pkcs8 } from "./keys";

/*
# TLDR;

sign a jwt and send it in Authorization header with "vapid" scheme, eg:

Authorization: `vapid t=${some_signed_jwt},k=${public_key}`

# more here

SECTION 2 of https://datatracker.ietf.org/doc/rfc8292/

Application servers that wish to self-identify generate and maintain
a signing key pair.  This key pair MUST be usable with the Elliptic
Curve Digital Signature Algorithm (ECDSA) over the P-256 curve
[FIPS186].  Use of this key when sending push messages establishes an
identity for the application server that is consistent across
multiple messages.
*/

export async function vapidSchemeAuthHeader(endpoint: string) {
  const PRIVATE_KEY = await cryptokey_from_Base64url_pkcs8(process.env.WEBPUSH_AUTHHEADER_PRIVATE_BASE64URL_PKCS8);
  const PUBLIC_KEY = process.env.WEBPUSH_AUTHHEADER_PUBLIC_BASE64URL_RAW;

  const jwt = await new SignJWT({
    exp: oneHourFromNowSeconds(),
    sub: process.env.VAPID_SUB,
    aud: new URL(endpoint).origin,
  })
    .setProtectedHeader({ alg: "ES256", typ: "JWT" })
    .sign(PRIVATE_KEY);

  return `vapid t=${jwt},k=${PUBLIC_KEY}`;
}

//debug with this
function oneHourFromNowSeconds() {
  const ONE_HOUR_IN_SECONDS = 60 * 60;
  const d = new Date();
  const exp = Math.floor(d.getTime() / 1000);
  return exp + ONE_HOUR_IN_SECONDS;
}

//the required "exp" claim MUST NOT be more than 24 hours from the time of the request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function expSeconds() {
  new Date().getTime() / 1000 + 60 * 60 * 23;

  const TWENTY_THREE_HOURS_IN_SECONDS = 60 * 60 * 23;
  const d = new Date();
  const exp = Math.floor(d.getTime() / 1000);
  return exp + TWENTY_THREE_HOURS_IN_SECONDS;
}
