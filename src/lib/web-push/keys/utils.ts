import { base64urlFromUint8Array } from "#src/utils/jsone";

/** private keys CAN NOT be exported in raw format */
export async function keyexport_pkcs8(cryptoKey: CryptoKey) {
  const buf = await crypto.subtle.exportKey("pkcs8", cryptoKey);
  return base64urlFromUint8Array(new Uint8Array(buf));
}

export async function keyexport_raw(cryptoKey: CryptoKey) {
  const buf = await crypto.subtle.exportKey("raw", cryptoKey);
  return base64urlFromUint8Array(new Uint8Array(buf));
}
