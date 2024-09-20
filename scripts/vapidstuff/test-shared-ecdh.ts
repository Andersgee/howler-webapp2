import { HKDF } from "#src/lib/web-push/ecdh";
import { generateECDHkey } from "#src/lib/web-push/keys";

function hmm(p: PushSubscription) {
  const useragent_auth_key = p.getKey("auth"); //this is the "auth_secret"  https://datatracker.ietf.org/doc/html/draft-ietf-webpush-encryption-08#section-3.4
  const useragent_public_key = p.getKey("p256dh"); // <- this is the user agents ECDH public key
  //p.endpoint
  //p.expirationTime
}

async function main() {
  const { privateKey_Base64url_pkcs8: as_private, publicKey_Base64url_raw: as_public, pair } = await generateECDHkey();
  console.log({
    "pair.privateKey.usages": pair.privateKey.usages,
    "pair.publicKey.usages": pair.publicKey.usages,
  });

  const { privateKey_Base64url_pkcs8: ua_private, publicKey_Base64url_raw: ua_public } = await generateECDHkey();

  const a = await HKDF(as_private, ua_public, as_public);
  const b = await HKDF(ua_private, as_public, ua_public);
  console.log({ a, b });
}

void main();
