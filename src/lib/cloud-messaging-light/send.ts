import { dbfetch } from "#src/db";
import { getAccessToken, sendMessage } from "./admin";

const db = dbfetch();

/** see [Message reference here](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message)  */
type Message = {
  data?: Record<string, string>;
  /** cross platform */
  notification: { title: string; body: string; image?: string };
  /** additional options for webpush. make sure to put link */
  webpush: {
    fcm_options: { link: string };
    /** properties as difened in [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification) */
    notification?: {
      icon?: string;
      badge?: string;
      //vibrate: [200, 100, 200], //https://developer.mozilla.org/en-US/docs/Web/API/Notification/vibrate
    } & Record<string, string>;
  } & Record<string, unknown>;
} & Record<string, unknown>;

/** see [Message reference here](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message)  */
export async function sendCloudMessageToTokens(tokens: string[], message: Message) {
  if (tokens.length === 0) return;

  const accessToken = await getOrRefreshAccessToken();
  for (const token of tokens) {
    try {
      const res = await sendMessage(accessToken, { token, ...message });
      if (!res.ok) {
        await handleBadFcmResponse(res, token);
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

  const fcmTokens = await db.selectFrom("FcmToken").select("token").where("userId", "in", userIds).execute();

  for (const fcmToken of fcmTokens) {
    const token = fcmToken.token;
    try {
      const res = await sendMessage(accessToken, { token, ...message });
      if (!res.ok) {
        await handleBadFcmResponse(res, token);
      }
    } catch (err) {
      console.log("sendCloudMessage, err:", err);
    }
  }
}

async function handleBadFcmResponse(res: Response, token: string) {
  // https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await res.json();
  console.log("res not ok, json:", JSON.stringify(data, null, 2));
  if (res.status === 400) {
    console.log("INVALID_ARGUMENT... bad payload probably");
  } else if (res.status === 401) {
    //console.log("THIRD_PARTY_AUTH_ERROR... not super clear what to do here. prob delete token:", token);
    await db.deleteFrom("FcmToken").where("token", "=", token).execute();
  } else if (res.status === 403) {
    console.log("SENDER_ID_MISMATCH... this should never happen?");
  } else if (res.status === 404) {
    //console.log("UNREGISTERED... should remove token:", token);
    await db.deleteFrom("FcmToken").where("token", "=", token).execute();
  } else if (res.status === 429) {
    console.log("QUOTA_EXCEEDED... should retry with exponential backoff, minimum initial delay of 1 minute.");
  } else if (res.status === 500) {
    console.log("INTERNAL... unkown server error, retry according to same as 503");
  } else if (res.status === 503) {
    console.log(
      "UNAVAILABLE... server overloaded, should retry with exponential backoff, minimum initial delay of 1 second."
    );
  } else {
    console.log("UNSPECIFIED_ERROR... spec dont say what to to for response status:", res.status);
  }
}

async function getOrRefreshAccessToken() {
  //serverless style, keep accessToken in db
  const id = BigInt(1);
  let accessToken = await db.selectFrom("CloudMessageAccessToken").selectAll().where("id", "=", id).executeTakeFirst();
  if (!accessToken) {
    //the first ever token
    const { access_token, expiresDate } = await getAccessToken();
    accessToken = {
      id: id,
      token: access_token,
      expires: expiresDate,
    };
    await db.insertInto("CloudMessageAccessToken").values(accessToken).execute();
  } else if (accessToken.expires.getTime() - Date.now() < 60000) {
    //needs refresh, 60s margin?
    const { access_token, expiresDate } = await getAccessToken();
    accessToken = {
      id: id,
      token: access_token,
      expires: expiresDate,
    };
    await db
      .updateTable("CloudMessageAccessToken")
      .where("id", "=", id)
      .set({ token: accessToken.token, expires: accessToken.expires })
      .execute();
  }

  return accessToken.token;
}
