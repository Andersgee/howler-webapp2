import { vapidSchemeAuthHeader } from "./vapid-scheme-auth-header";
import { webPushMessageEncryption } from "./web-push-message-encryption";

//spec: https://datatracker.ietf.org/doc/rfc8292/
//payload encryption: https://www.rfc-editor.org/rfc/rfc8291.txt
//the encryption thing was interesting but prob just use "npm install http_ece"

//also good info here: https://www.rfc-editor.org/rfc/rfc8030

/*
Replacing:
https://www.rfc-editor.org/rfc/rfc8030#section-5.4

A push message with a topic replaces any outstanding push message with an identical topic.

tldr; any push message that has a topic will replace undelivered messages with that topic to that particular pushSubscription
also: a topic must no more than 32 characters and use the base64url alphabet

also its possible to request reciept of when the push message is actually delivered:
https://www.rfc-editor.org/rfc/rfc8030#section-5.1

*/

type Urgency = "very-low" | "low" | "normal" | "high";

// time to live in seconds that push service should retain message
//const TTL = 2419200; //this is what "web-push" package uses as default aka 28 days
//const TTL = 60;
//const URGENCY: Urgency = "normal";

type Params = {
  payload: string;
  pushSubscription: {
    endpoint: string;
    p256dh_base64url: string;
    auth_base64url: string;
  };
  /** default: "normal" */
  urgency?: Urgency;
  /** default: 1209600 aka 2 weeks */
  ttl?: number;
};

export async function webPush({ payload, pushSubscription, urgency = "normal", ttl = 1209600 }: Params) {
  const appserver = {
    private_base64url_pkcs8: process.env.WEBPUSH_APPSERVER_PRIVATE_BASE64URL_PKCS8,
    public_base64url: process.env.NEXT_PUBLIC_WEBPUSH_APPSERVER_PUBLIC_BASE64URL_RAW,
  };

  const authHeader = await vapidSchemeAuthHeader({ pushSubscription, appserver });
  const body = await webPushMessageEncryption({ payload, pushSubscription, appserver });

  return await fetch(pushSubscription.endpoint, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "TTL": `${ttl}`,
      "Urgency": urgency,
      //"Topic": "someeventidperhaps",
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
    },
    body,
  });
}
