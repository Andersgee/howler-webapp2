import { dbfetch } from "#src/db";
import type { BaseMessage } from "firebase-admin/messaging";
import { getAccessToken, sendMessage } from "./admin";

async function getOrRefreshAccessToken() {
  //serverless style, keep accessToken in db
  const id = BigInt(1);
  let accessToken = await dbfetch()
    .selectFrom("CloudMessageAccessToken")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  if (!accessToken) {
    //the first ever token
    const { access_token, expiresDate } = await getAccessToken();
    accessToken = {
      id: id,
      token: access_token,
      expires: expiresDate,
    };
    await dbfetch().insertInto("CloudMessageAccessToken").values(accessToken).execute();
  } else if (accessToken.expires.getTime() - Date.now() < 30000) {
    //needs refresh, 30s margin?
    const { access_token, expiresDate } = await getAccessToken();
    accessToken = {
      id: id,
      token: access_token,
      expires: expiresDate,
    };
    await dbfetch()
      .updateTable("CloudMessageAccessToken")
      .where("id", "=", id)
      .set({ token: accessToken.token, expires: accessToken.expires })
      .execute();
  }

  return accessToken.token;
}

export async function sendCloudMessage(userIds: bigint[], message: BaseMessage) {
  if (userIds.length === 0) return;

  const accessToken = await getOrRefreshAccessToken();

  const fcmTokens = await dbfetch().selectFrom("FcmToken").select("token").where("userId", "in", userIds).execute();

  for (const fcmToken of fcmTokens) {
    try {
      const res = await sendMessage(accessToken, { token: fcmToken.token, ...message });
      //TODO: deal with response errors https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
      if (!res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const d = await res.json();
        //d.error_code //
        console.log("not ok json:", d);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

//https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
//most of these have "recommended actions" but it boils down to "make sure to delete stale tokens and have valid payloads"
const ERROR_CODES = [
  "UNSPECIFIED_ERROR",
  "INVALID_ARGUMENT",
  "UNREGISTERED",
  "SENDER_ID_MISMATCH",
  "QUOTA_EXCEEDED",
  "UNAVAILABLE",
  "INTERNAL",
  "THIRD_PARTY_AUTH_ERROR",
];
