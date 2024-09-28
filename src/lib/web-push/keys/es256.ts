import { uint8ArrayFromBase64url } from "#src/utils/jsone";
import { keyexport_pkcs8, keyexport_raw } from "./utils";

export async function keygenerate_ES256() {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true, //allow exporting
    ["sign", "verify"] //this sets "sign" on the private key and "verify" on the public key
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

export async function keyimport_ES256_pkcs8(base64url: string) {
  return await crypto.subtle.importKey(
    "pkcs8",
    uint8ArrayFromBase64url(base64url),
    { name: "ECDSA", namedCurve: "P-256" },
    false, //dont allow re-exporting this
    [
      "sign", //this is only the private key
    ]
  );
}

export function keyimport_ES256_raw(base64url: string) {
  return uint8ArrayFromBase64url(base64url);
}
