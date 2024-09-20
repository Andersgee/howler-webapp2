import { vapidSchemeAuthHeader } from "./vapid-scheme-auth-header";

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
  const authHeader = await vapidSchemeAuthHeader(endpoint);
  return await fetch(endpoint, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "TTL": `${TTL}`,
      "Urgency": `${URGENCY}`,
      //"Topic": "someeventidperhaps",
      "Content-Encoding": "aes128gcm",
    },
    body, //TODO: this should be encrypted... with aes128gcm apparently?
  });
}
