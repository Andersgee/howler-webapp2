import admin from "firebase-admin";
import { type BaseMessage, type TokenMessage, getMessaging } from "firebase-admin/messaging";
import { getStaleFcmtokens } from "./stale-token";

/*
note to self:
Im using firebase-admin here, required nodejs runtime
but its possible to use regular post requests instead
Im pretty sure the actual body eg BaseMessage is the same

in fact, Im having to read the REST api spec anyway:
https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
in order to understand what the options are

anyway, lets get it working the easy way first
*/

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.HOWLER_FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.HOWLER_FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY,
  }),
});

const messaging = getMessaging(app);

export async function sendTokenMessage(token: string, message: BaseMessage) {
  const tokenMessage: TokenMessage = { ...message, token };
  return await messaging.send(tokenMessage);
}

/**
 * same message to multiple tokens
 *
 * returns a list of stale tokens which should be removed from db
 */
export async function sendTokenMessages(tokens: string[], message: BaseMessage) {
  const tokenMessages: TokenMessage[] = tokens.map((token) => ({ ...message, token }));
  const batchResponse = await messaging.sendEach(tokenMessages);
  return getStaleFcmtokens(tokens, batchResponse);
}
