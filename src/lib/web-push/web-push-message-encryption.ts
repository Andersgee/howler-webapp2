import { uint8ArrayFromBase64url } from "#src/utils/jsone";
import { contentCodingHeader, contentEncrypt } from "./encrypted-content-encoding";
import { hkdf, hkdf_expand } from "./hmac/hkdf";
import { generateSharedECDHSecret, keyimport_ECDH_pkcs8, keyimport_ECDH_raw_as_cryptokey } from "./keys/ecdh";
import { generateCekInfo, generateInfo, generateNonceInfo, generateSalt, uint8ArrayFromString } from "./utils";

type Params = {
  /** your message */
  payload: string;
  /**  */
  pushSubscription: {
    /**  */
    p256dh_base64url: string;
    /**  */
    auth_base64url: string;
  };
  appserver: {
    /**  */
    private_base64url_pkcs8: string;
    /**  */
    public_base64url: string;
  };
  /**  */
  customSalt?: Uint8Array;
};

/**
 * # Message Encryption for Web Push
 * [rfc8291](https://datatracker.ietf.org/doc/html/rfc8291#)
 *
 *
 */
export async function webPushMessageEncryption(params: Params) {
  // massage
  const salt_uint8array = params.customSalt ?? generateSalt();
  const ua_public = params.pushSubscription.p256dh_base64url;
  const as_public = params.appserver.public_base64url;
  const as_private_cryptokey = await keyimport_ECDH_pkcs8(params.appserver.private_base64url_pkcs8);
  const auth_secret_uint8array = uint8ArrayFromBase64url(params.pushSubscription.auth_base64url);
  const ua_public_cryptokey = await keyimport_ECDH_raw_as_cryptokey(ua_public);
  const as_public_uint8array = uint8ArrayFromBase64url(as_public);
  const plaintext = uint8ArrayFromString(params.payload);

  // encryption steps
  const info = generateInfo(ua_public, as_public);
  const ecdh_secret = await generateSharedECDHSecret(as_private_cryptokey, ua_public_cryptokey);
  const { okm: ikm } = await hkdf(auth_secret_uint8array, ecdh_secret, info, 32);
  const cek_info = generateCekInfo();
  const { prk, okm: cek } = await hkdf(salt_uint8array, ikm, cek_info, 16);
  const nonce_info = generateNonceInfo();
  const nonce = await hkdf_expand(prk, nonce_info, 12);
  const header = contentCodingHeader(salt_uint8array, as_public_uint8array);
  const plaintext_padded = new Uint8Array([...plaintext, 2]);
  const ciphertext = await contentEncrypt(plaintext_padded, cek, nonce);
  const body = new Uint8Array([...header, ...ciphertext]);

  return body;
}
