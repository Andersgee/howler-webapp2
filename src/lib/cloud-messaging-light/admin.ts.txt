import { z } from "zod";
import { SignJWT } from "jose";

/*
notes to self:
so the "firebase-admin/messaging" is convenient and all but 
I dont need all the bells and whistles and also I cant use edge runtime
obviously its very bloated for what in the end amounts to a POST request

REST api spec: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages

from looking at firebase-admin source code it looks like
1. get an access_token if the one you have is expired
2. POST to https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send
with header Authorization: `Bearer ${access_token}`
and body as specified here: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send
3. yep thats it
4. keep in mind the types TokenMessage etc dont quite match the spec
they remap some stuff keys before sending to match latest spec so cant quite re-use their typings
*/

const SERVICE_ACCOUNT = {
  projectId: process.env.HOWLER_FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.HOWLER_FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY,
};

//const SECRET = new TextEncoder().encode(SERVICE_ACCOUNT.privateKey);
//nope. jose SignJWT.sign() needs key in Uint8Array or CryptoKey format
//see: https://github.com/panva/jose/issues/210#jws-alg
async function getSECRET() {
  return await cryptoKeyFromPem(SERVICE_ACCOUNT.privateKey);
}

const GOOGLE_TOKEN_AUDIENCE = "https://accounts.google.com/o/oauth2/token";
const GOOGLE_AUTH_TOKEN_HOST = "accounts.google.com";
const GOOGLE_AUTH_TOKEN_PATH = "/o/oauth2/token";
const ONE_HOUR_IN_SECONDS = 60 * 60;
const FCM_SEND_HOST = "fcm.googleapis.com";

/** see [Message reference here](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message)  */
export async function sendMessage(accessToken: string, message: Record<string, unknown>, validate_only = false) {
  const urlPath = `/v1/projects/${SERVICE_ACCOUNT.projectId}/messages:send`;
  const url = `https://${FCM_SEND_HOST}${urlPath}`;
  return await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ validate_only, message }),
  });
}

async function createAuthJwt() {
  const SECRET = await getSECRET();

  //copy pasted, but spec sais I only need either firebase.messaging or cloud-platform
  //yep only firebase.messaging works fine.
  const scope = [
    //"https://www.googleapis.com/auth/cloud-platform",
    //"https://www.googleapis.com/auth/firebase.database",
    "https://www.googleapis.com/auth/firebase.messaging",
    //"https://www.googleapis.com/auth/identitytoolkit",
    //"https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const d = new Date();
  const nowSeconds = Math.floor(d.getTime() / 1000);
  const expiresSeconds = nowSeconds + ONE_HOUR_IN_SECONDS;

  const token = await new SignJWT({
    aud: GOOGLE_TOKEN_AUDIENCE,
    iat: nowSeconds,
    exp: expiresSeconds, //"NumericDate", seconds from 1970-01-01,
    iss: SERVICE_ACCOUNT.clientEmail,
    scope: scope,
  })
    .setProtectedHeader({ alg: "RS256" })
    .sign(SECRET);

  const expiresDate = new Date(expiresSeconds * 1000);
  return { token, expiresDate };
}

export async function getAccessToken() {
  const { token, expiresDate } = await createAuthJwt();
  const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`;
  const url = `https://${GOOGLE_AUTH_TOKEN_HOST}${GOOGLE_AUTH_TOKEN_PATH}`;
  const res = await fetch(url, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: postData,
  });

  const data = z
    .object({
      access_token: z.string(),
      expires_in: z.number(), //seconds, ish 3600
      //token_type: z.string(), //"Bearer"
    })
    .parse(await res.json());

  return {
    access_token: data.access_token,
    //expires_in_seconds: data.expires_in,
    expiresDate,
  };
}

/** read the key into a CryptoKey object for jose.sign() */
async function cryptoKeyFromPem(pem: string) {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length - 1);
  const binaryDer = Buffer.from(pemContents, "base64");

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", //format
    binaryDer, //data
    {
      //algorithm, https://developer.mozilla.org/en-US/docs/Web/API/RsaHashedImportParams
      //name: "RSA-PSS",
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"] //allowed usages
  );

  return cryptoKey;
}
