import { uint8ArrayFromBase64url } from "#src/utils/jsone";

function randomUint8Array(len: number) {
  const v = new Uint8Array(len);
  return crypto.getRandomValues(v);
}

/** 16 random bytes */
export function generateSalt() {
  return randomUint8Array(16);
}

/**
 * https://datatracker.ietf.org/doc/html/rfc8188#section-2.1
 *
 * The "rs" or record size parameter contains an unsigned 32-bit
 * integer in network byte order that describes the record size in
 * octets.  Note that it is, therefore, impossible to exceed the
 * 2^36-31 limit on plaintext input to AEAD_AES_128_GCM. Values
 * smaller than 18 are invalid.
 */
export function uint8ArrayFromInt_in_network_byte_order(recordSize = 4096) {
  const k = new Uint32Array([recordSize]);
  return new Uint8Array(k.buffer).reverse();
}

export function generateInfo(ua_public: string, as_public: string) {
  const a = uint8ArrayFromString("WebPush: info\0");
  const b = uint8ArrayFromBase64url(ua_public);
  const c = uint8ArrayFromBase64url(as_public);

  return new Uint8Array([...a, ...b, ...c]);
}

export function generateCekInfo() {
  return uint8ArrayFromString("Content-Encoding: aes128gcm\0");
}

export function generateNonceInfo() {
  return uint8ArrayFromString("Content-Encoding: nonce\0");
}

export function uint8ArrayFromString(str: string) {
  const textEncoder = new TextEncoder();
  return textEncoder.encode(str);
}
