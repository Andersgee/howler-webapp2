import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";

/**
 * note to self: "ECDSA on the NIST P-256 curve" is also called "ES256"
 *
 * this only need to be done once
 *
 * this is for the Authorization header with "vapid" scheme.
 *
 * aka
 *
 * `vapid t=${jwt},k=${PUBLIC_KEY}`,
 *
 * # Example
 * ```ts
 * const keypair = generateES256key()
 * const PRIVATE_KEY = keypair.privateKey
 * const PUBLIC_KEY = keypair.publicKey
 *
 * const aud = new URL(endpoint).origin;
 * const jwt = await new jose.SignJWT({
 *   exp: new Date().getTime()/1000 + 60 * 60 * 23, //max 24 hours from now
 *   sub: "mailto:someperson@gmail.com", //your concact info (email or website)
 *   aud: new URL(endpoint).origin, //origin of push servive
 * })
 *   .setProtectedHeader({ alg: "ES256" })
 *   .sign(PRIVATE_KEY);
 *
 * const res = await fetch(endpoint, {
 *   cache: "no-store",
 *   method: "POST",
 *   headers: {
 *     "Authorization": `vapid t=${jwt},k=${PUBLIC_KEY}`,
 *     "TTL": "60",
 *     "Urgency": "normal",
 *     "Topic": "some-topic-in-urlsafe-alphabet",
 *     "Content-Encoding": "aes128gcm",
 *   },
 *   body,
 * })
 * ```
 */
export async function generateES256key() {
  const pair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" }, //according to spec
    true, //allow exporting
    ["sign", "verify"] //this sets "sign" on the private key and "verify" on the public key
  );

  const publicKeyBuffer = await crypto.subtle.exportKey("raw", pair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", pair.privateKey);

  return {
    privateKey_Base64url_pkcs8: base64urlFromUint8Array(new Uint8Array(privateKeyBuffer)),
    publicKey_Base64url_raw: base64urlFromUint8Array(new Uint8Array(publicKeyBuffer)),
  };
}

/**
 * jose.sign needs the private key in CryptoKey format
 *
 * so this is a utility for reading process.env.VAPID_JWT_AUTH_PRIVATE_KEY
 *
 * from generateES256key()
 *
 * all other keys as far as I know we can just use as the saved
 * publicKeyBase64url
 * or
 * uint8ArrayFromBase64url(publicKeyBase64url)
 * or
 * Buffer.from(publicKeyBase64url,"base64url")
 */
export async function cryptokey_from_Base64url_pkcs8(Key_Base64url_pkcs8: string) {
  return await crypto.subtle.importKey(
    "pkcs8",
    uint8ArrayFromBase64url(Key_Base64url_pkcs8),
    { name: "ECDSA", namedCurve: "P-256" },
    false, //dont allow re-exporting this
    [
      "sign", //this is only the private key
    ]
  );
}

/*
export async function importPrivateES256Key(privateKey_b64url: string) {
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
*/

/**
 * this only need to be done once
 *
 * this is the servers keys used for encrypting request body
 *
 * the public key needs to be used by the client when subscribing to push
 *
 * # example
 *
 * ```ts
 *
 * serviceWorkerRegistration.pushManager
 *   .subscribe({
 *     userVisibleOnly: true,
 *     applicationServerKey: vapidImportPublicKey(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY_B64URL),
 *   })
 * ```
 *
 */
export async function generateECDHkey() {
  const pair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" }, //according to spec
    true, //allow exporting
    ["deriveKey", "deriveBits"]
  );

  const publicKeyBuffer = await crypto.subtle.exportKey("raw", pair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", pair.privateKey);

  return {
    pair,
    privateKey_Base64url_pkcs8: base64urlFromUint8Array(new Uint8Array(privateKeyBuffer)),
    publicKey_Base64url_raw: base64urlFromUint8Array(new Uint8Array(publicKeyBuffer)),
    publicKeyBuffer,
    privateKeyBuffer,
  };
}

export async function cryptokey_from_Base64url_ECDH(Key_Base64url_pkcs8: string) {
  return await crypto.subtle.importKey(
    "pkcs8",
    uint8ArrayFromBase64url(Key_Base64url_pkcs8),
    { name: "ECDH", namedCurve: "P-256" },
    true, //dont allow re-exporting this
    ["deriveKey", "deriveBits"]
  );
}

export async function cryptokey_from_Base64url_raw_ECDH(Key_Base64url: string) {
  return await crypto.subtle.importKey(
    "raw",
    uint8ArrayFromBase64url(Key_Base64url),
    { name: "ECDH", namedCurve: "P-256" },
    false, //dont allow re-exporting this
    []
  );
}
