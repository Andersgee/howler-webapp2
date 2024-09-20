import { generateECDHkey, generateES256key, cryptokey_from_Base64url_pkcs8 } from "#src/lib/web-push/keys";

function hmm(p: PushSubscription) {
  const useragent_auth_key = p.getKey("auth");
  const useragent_public_key = p.getKey("p256dh");
}

async function main() {
  const authhederkey = await generateES256key();
  const authheder_private_base64url_pkcs8 = authhederkey.privateKey_Base64url_pkcs8;
  const authheder_public_base64url_raw = authhederkey.publicKey_Base64url_raw;

  const vapidkey = await generateECDHkey();
  const appserver_public_key_base64url_raw = vapidkey.publicKey_Base64url_raw;
  const appserver_private_key_base64url_pkcs8 = vapidkey.privateKey_Base64url_pkcs8;

  console.log({
    authheder_public_base64url_raw,
    authheder_private_base64url_pkcs8,
    appserver_public_key_base64url_raw,
    appserver_private_key_base64url_pkcs8,
  });
}

void main();
