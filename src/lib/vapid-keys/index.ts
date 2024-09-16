import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";

//https://autopush.readthedocs.io/en/latest/http.html#error-codes
//spec: https://datatracker.ietf.org/doc/rfc8292/
//payload encryption: https://www.rfc-editor.org/rfc/rfc8291.txt

//general "requests the delivery of a push message" spec:
//https://datatracker.ietf.org/doc/html/rfc8030#page-10
//some info found there:
//push service must return a res.headers.Location
//requester can specify "TTL", "Urgency" and "Topic" headers
//and its possible to replace push-messages before they are delivered to client
//but only if it originally had a Topic
//btw a Topic must use the url-safe alphabet (aka base64url) and no more than 32 chars
//etc...

// notes to self: "ECDSA on the NIST P-256 curve" is also called "ES256"
// this what the webpush spec expects
//

// example usage
// const pair = await vapidGenerateKeyPair();
// const publicKeyString = await vapidExportPublicKey(pair.publicKey);
// const privateKeyString = await vapidExportPrivateKey(pair.privateKey);
// console.log({ privateKeyString, publicKeyString });
//
// const rePublic = vapidImportPublicKey(publicKeyString);
// const rePrivate = await vapidImportPrivateKey(privateKeyString);

export function vapidImportPublicKey(publicKey_b64url: string) {
  //when asking for pushmanager it wants it in uint8array
  //but when posting from backend to service it wants the regular b64url
  return uint8ArrayFromBase64url(publicKey_b64url);
}

export async function vapidImportPrivateKey(privateKey_b64url: string) {
  const data = uint8ArrayFromBase64url(privateKey_b64url);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    data,
    { name: "ECDSA", namedCurve: "P-256" },
    false, //dont allow re-exporting this
    [
      "sign", //this is only the private key
    ]
  );

  return cryptoKey;
}

//Below here is for initial generation of key pair
//and exporting them to strings for easy import with the functions above

export async function vapidGenerateKeyPair() {
  const pair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" }, //according to spec
    true, //allow exporting
    ["sign", "verify"] //this sets "sign" on the private key and "verify" on the public key
  );
  return pair;
}

export async function vapidExportPublicKey(pairPublicKey: CryptoKey) {
  const publicKeyBuffer = await crypto.subtle.exportKey("raw", pairPublicKey);
  const publicKey_b64url = base64urlFromUint8Array(new Uint8Array(publicKeyBuffer));
  return publicKey_b64url;
}

export async function vapidExportPrivateKey(pairPrivateKey: CryptoKey) {
  const data = await crypto.subtle.exportKey("pkcs8", pairPrivateKey);
  const privateKey_b64url = base64urlFromUint8Array(new Uint8Array(data));
  return privateKey_b64url;
}
