import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";

//crypto.subtle forbids exporting/importing private ECDH keys in raw format

//turns out there is a way to access a raw private key
//by going via jsonWebKey and then it will be there in jsonWebKey.d (base64url encoded)

//https://stackoverflow.com/questions/71609132/extracting-a-private-key-buffer-from-webcrypto-generated-cryptokey-private
//https://jsfiddle.net/y64zec73/1/

export async function read_actual_key_from_cryptokey(k: CryptoKey) {
  const jsonWebKey = await crypto.subtle.exportKey("jwk", k);

  const key_base64url = jsonWebKey.d;
  if (!key_base64url) {
    throw new Error("could not read actual key from cryptokey");
  }
  const key_uint8array = uint8ArrayFromBase64url(key_base64url);
  if (key_uint8array.length !== 32) {
    throw new Error(
      `could not read actual key from cryptokey, im expecting it to be 32 bytes but it has length: ${key_uint8array.length}`
    );
  }

  console.log("jsonWebKey:", jsonWebKey);

  return {
    key_base64url,
    key_uint8array: uint8ArrayFromBase64url(key_base64url),
  };
}

export async function get_cryptokey_as_jwk(k: CryptoKey) {
  const jsonWebKey = await crypto.subtle.exportKey("jwk", k);
  return jsonWebKey;
}

/**
 * this returns the private key as a CryptoKey
 *
 * based on https://stackoverflow.com/a/77560330
 *
 * I need this function to reproduce example... but they only give raw private,public, and crypto.subtle does
 * not allow importing (or exporting) a private ECDH in raw format
 *
 */
export async function make_private_cryptokey_from_raw_ECDH_pair(
  privateKey_32bytes: Uint8Array,
  publicKey_65bytes: Uint8Array
) {
  if (privateKey_32bytes.length !== 32) {
    throw new Error(`private key bytes should be 32 bytes, but is ${privateKey_32bytes.length} bytes`);
  }
  if (publicKey_65bytes.length !== 65) {
    throw new Error(`pyblic key bytes should be 65 bytes, but is ${publicKey_65bytes.length} bytes`);
  }
  const jsonWebKeyData = {
    key_ops: ["deriveKey", "deriveBits"],
    crv: "P-256",
    ext: true,
    d: base64urlFromUint8Array(privateKey_32bytes),
    kty: "EC",
    x: base64urlFromUint8Array(publicKey_65bytes.slice(1, 32 + 1)),
    y: base64urlFromUint8Array(publicKey_65bytes.slice(32 + 1)),
  };

  const cryptokey = await crypto.subtle.importKey("jwk", jsonWebKeyData, { name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveKey",
    "deriveBits",
  ]);

  return cryptokey;
}
