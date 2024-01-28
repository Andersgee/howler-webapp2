/*
notes to self:
so the "firebase-admin/messaging" is convenient and all but 
I dont need all the bells and whistles and also I cant use edge runtime
obviously its very bloated for what in the end amounts to a fetch() call

discovery document? https://firebase.googleapis.com/$discovery/rest?version=v1beta1

from looking at the source it looks like
1. get a token if the one you have is expired

*/

import { z } from "zod";
import { jwtVerify, SignJWT, JWTPayload } from "jose";
import { importPrivateKey } from "./import-key";

const SERVICE_ACCOUNT = {
  projectId: process.env.HOWLER_FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.HOWLER_FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY,
};

//const SECRET = new TextEncoder().encode(SERVICE_ACCOUNT.privateKey);
//nope.jose SignJWT(SECRET).sign needs SECRET in Uint8Array or CryptoKey format
//see: https://github.com/panva/jose/issues/210#jws-alg

const GOOGLE_TOKEN_AUDIENCE = "https://accounts.google.com/o/oauth2/token";
const GOOGLE_AUTH_TOKEN_HOST = "accounts.google.com";
const GOOGLE_AUTH_TOKEN_PATH = "/o/oauth2/token";

const ONE_HOUR_IN_SECONDS = 60 * 60;
const JWT_ALGORITHM = "RS256";

async function createAuthJwt(): Promise<string> {
  const SECRET = await importPrivateKey(process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY);

  const scope = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/firebase.database",
    "https://www.googleapis.com/auth/firebase.messaging",
    "https://www.googleapis.com/auth/identitytoolkit",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const nowSeconds = Math.round(Date.now() / 1000);
  const token = await new SignJWT({
    aud: GOOGLE_TOKEN_AUDIENCE,
    iat: nowSeconds,
    exp: nowSeconds + ONE_HOUR_IN_SECONDS, //"NumericDate", seconds from 1970-01-01,
    iss: SERVICE_ACCOUNT.clientEmail,
    scope: scope,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .sign(SECRET);

  return token;
}

export async function getAccessToken() {
  const token = await createAuthJwt();
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
  console.log("res.ok:", res.ok);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await res.json();
  console.log("json:", json);
  const data = z
    .object({
      access_token: z.string(),
      expires_in: z.number(), //seconds, ish 3600
      //token_type: z.string(), //"Bearer"
    })
    .parse(json);

  return data;
}
