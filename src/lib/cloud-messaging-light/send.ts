import { dbfetch } from "#src/db";
import { getAccessToken, sendMessage } from "./admin";

/** see [Message reference here](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message)  */
type Message = {
  data?: Record<string, string>;
  /** cross platform */
  notification: { title: string; body: string; image?: string };
  /** additional options for webpush. make sure to put link */
  webpush: {
    /** properties as difened in [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification) */
    notification?: {
      icon?: string;
      //vibrate: [200, 100, 200], //https://developer.mozilla.org/en-US/docs/Web/API/Notification/vibrate
    } & Record<string, string>;
    fcm_options: { link: string };
  } & Record<string, unknown>;
} & Record<string, unknown>;

export async function sendCloudMessageToTokens(tokens: string[], message: Message) {
  const accessToken = await getOrRefreshAccessToken();
  for (const token of tokens) {
    try {
      const res = await sendMessage(accessToken, { token, ...message });
      //TODO: deal with response errors https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
      if (!res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await res.json();
        console.log("res not ok, json:", JSON.stringify(data, null, 2));
        if (res.status === 400) {
          console.log("INVALID_ARGUMENT... bad payload probably");
        } else if (res.status === 401) {
          console.log("THIRD_PARTY_AUTH_ERROR... not super clear what to do here. prob delete token:", token);
        } else if (res.status === 403) {
          console.log("SENDER_ID_MISMATCH... this should never happen?");
        } else if (res.status === 404) {
          console.log("UNREGISTERED... should remove token:", token);
        } else if (res.status === 429) {
          console.log("QUOTA_EXCEEDED... should retry with exponential backoff, minimum initial delay of 1 minute.");
        } else if (res.status === 500) {
          console.log("INTERNAL... unkown server error, retry according to same as 503");
        } else if (res.status === 503) {
          console.log(
            "UNAVAILABLE... server overloaded, should retry with exponential backoff, minimum initial delay of 1 second."
          );
        } else {
          console.log("... spec dont describe what to to for response status:", res.status);
        }

        //d.error_code //
      }
    } catch (err) {
      console.log(err);
    }
  }
}

/** see [Message reference here](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message)  */
export async function sendCloudMessage(userIds: bigint[], message: Message) {
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
