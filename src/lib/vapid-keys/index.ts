import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";

// example usage
// const pair = await vapidGenerateKeyPair();
// const publicKeyString = await vapidExportPublicKey(pair.publicKey);
// const privateKeyString = await vapidExportPrivateKey(pair.privateKey);
// console.log({ privateKeyString, publicKeyString });
//
// const rePublic = vapidImportPublicKey(publicKeyString);
// const rePrivate = await vapidImportPrivateKey(privateKeyString);

export async function vapidGenerateKeyPair() {
  const pair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveKey",
    "deriveBits",
  ]);
  return pair;
}

/** pass it the pair.publicKey */
export async function vapidExportPublicKey(pairPublicKey: CryptoKey) {
  const publicKeyBuffer = await crypto.subtle.exportKey("raw", pairPublicKey);
  const publicKeyString = base64urlFromUint8Array(new Uint8Array(publicKeyBuffer));
  return publicKeyString;
}

export async function vapidExportPrivateKey(pairPrivateKey: CryptoKey) {
  const data = await crypto.subtle.exportKey("pkcs8", pairPrivateKey);
  const privateKeyString = base64urlFromUint8Array(new Uint8Array(data));
  return privateKeyString;
}

export function vapidImportPublicKey(publicKeyString: string) {
  return uint8ArrayFromBase64url(publicKeyString);
}

export async function vapidImportPrivateKey(privateKeyString: string) {
  const data = uint8ArrayFromBase64url(privateKeyString);
  const cryptoKey = await crypto.subtle.importKey("pkcs8", data, { name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveKey",
    "deriveBits",
  ]);
  return cryptoKey;
}
