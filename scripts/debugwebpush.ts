import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { webPush } from "#src/lib/web-push";

const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dpGu0URg-6o:APA91bHo1-gqU6g5y5_LRyGpp_f0w0EQAtIFkZv0kQsMkBXAVOsw8aiJ5hNjJRay7y2vbYwNHvfaEaPzypSRdIkDwm7f69D7shHFgqhCr6zfboUUQru-jxeRRmcHOg8ZSE_p5hw5vIsQ",
  p256dh_base64url: "BLljo8JDDVZkDgYDNHbfm-dDRvjN4enJyz6wVMZ3bNAfbnZpLaVftQTes2GQXpd7S9vxOy66hkbbU2jsjMVoPzQ",
  auth_base64url: "9P5ng2SyEmFlS3W1BfJOfQ",
};

async function main() {
  const res = await webPush({
    payload: "hello",
    pushSubscription,
  });
  console.log(res);
}

void main();
