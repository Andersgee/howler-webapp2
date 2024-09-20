import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";
import { cryptokey_from_Base64url_ECDH, cryptokey_from_Base64url_raw_ECDH } from "./keys";

/**
 * this is supposed to return the same secret for either side
 *
 * return value is called IKM (input keying material)
 *
 * which is supposed to be input to HKDF() with SHA-256
 *
 * https://www.rfc-editor.org/rfc/rfc8291.html#section-3.4
 *
 *
 *
 * It appears I cant do this in "2 steps"? to double check that the input to HKDF are the same for both
 *
 * this should now be called HKDF() instead ....
 *
 * nvm: "Essentially deriveKey() is composed of deriveBits() followed by importKey()."
 * so I should be able to double check it
 *
 */
export async function HKDF(
  myPrivateKey_base64url: string,
  otherPublicKey_base64url: string,
  myPublicKey_base64url: string
) {
  console.log("HEJ 1");
  const myPrivateKey_cryptokey = await cryptokey_from_Base64url_ECDH(myPrivateKey_base64url);
  console.log("myPrivateKey_cryptokey.usages:", myPrivateKey_cryptokey.usages);
  console.log("HEJ 2");
  const otherPublicKey_cryptokey = await cryptokey_from_Base64url_raw_ECDH(otherPublicKey_base64url);
  console.log("HEJ 3");

  const salt = generateSalt();
  const info = generateInfo(otherPublicKey_base64url, myPublicKey_base64url);

  console.log("info:", info);

  //"Essentially deriveKey() is composed of deriveBits() followed by importKey().""
  const hmm = await crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: otherPublicKey_cryptokey,
    },
    myPrivateKey_cryptokey,
    16
  );
  console.log("hmm:", base64urlFromUint8Array(new Uint8Array(hmm)));

  const sharedSecret = await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: otherPublicKey_cryptokey,
    },
    myPrivateKey_cryptokey,
    {
      name: "HKDF",
      hash: "SHA-256",
      salt,
      info,
    },
    false,
    ["deriveKey"]
  );

  console.log("sharedSecret:", sharedSecret);
  //const key_buffer = await crypto.subtle.exportKey("pkcs8", sharedSecret);
  //const key_base64url = base64urlFromUint8Array(new Uint8Array(key_buffer));

  //return { key_buffer, key_base64url };
}

function generateSalt() {
  const v = new Uint8Array(16);
  return crypto.getRandomValues(v);
}

function generateInfo(ua_public: string, as_public: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode("WebPush: info\0"); //this is same as Buffer.from("")
  const b = uint8ArrayFromBase64url(ua_public);
  const c = uint8ArrayFromBase64url(as_public);
  return new Uint8Array([...a, ...b, ...c]);
}
