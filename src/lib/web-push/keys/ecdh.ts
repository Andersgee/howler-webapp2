import { uint8ArrayFromBase64url } from "#src/utils/jsone";
import { read_actual_key_from_cryptokey } from "./hack";
import { keyexport_raw, keyexport_pkcs8 } from "./utils";

export async function keygenerate_ECDH() {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, //allow exporting
    ["deriveKey", "deriveBits"]
  );

  const privateKey_pkcs8_base64url = await keyexport_pkcs8(privateKey);
  const publicKey_raw_base64url = await keyexport_raw(publicKey);

  return {
    privateKey,
    publicKey,
    privateKey_pkcs8_base64url,
    publicKey_raw_base64url,
  };
}

export async function keyimport_ECDH_pkcs8(base64url: string) {
  return await crypto.subtle.importKey(
    "pkcs8",
    uint8ArrayFromBase64url(base64url),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}
export async function keyimport_ECDH_pkcs8_actual_key_without_bunch_of_other_stuff(base64url: string) {
  const cryptokey = await keyimport_ECDH_pkcs8(base64url);
  return await read_actual_key_from_cryptokey(cryptokey);
}

export function keyimport_ECDH_raw(base64url: string) {
  return uint8ArrayFromBase64url(base64url);
}

export async function keyimport_ECDH_raw_as_cryptokey(base64url: string) {
  return await crypto.subtle.importKey(
    "raw",
    uint8ArrayFromBase64url(base64url),
    { name: "ECDH", namedCurve: "P-256" },
    false, //dont allow re-exporting this
    []
  );
}

export async function generateSharedECDHSecret(as_private_ecdh: CryptoKey, ua_public_ecdh: CryptoKey) {
  const shared_secret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: ua_public_ecdh },
    as_private_ecdh,
    32 * 8
  );
  return new Uint8Array(shared_secret);
}
