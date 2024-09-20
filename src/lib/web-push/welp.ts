//https://www.rfc-editor.org/rfc/rfc8291.txt

import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";
import { cryptokey_from_Base64url_pkcs8, cryptokey_from_Base64url_raw_ECDH, generateECDHkey } from "./keys";

//https://www.rfc-editor.org/rfc/rfc8291.html#section-3.4
//https://www.rfc-editor.org/rfc/rfc8188.html#section-2.1

/*
Push message encryption happens in four phases:

- A shared secret is derived using ECDH [ECDH] (see Section 3.1 of this document).

- The shared secret is then combined with the authentication secret
  to produce the input keying material (IKM) used in [RFC8188] (see
  Section 3.3 of this document).

- A content encryption key and nonce are derived using the process in [RFC8188].

- Encryption or decryption follows according to [RFC8188].




--------------

# Diffie-Hellman Key Agreement

For each new subscription that the user agent generates for an application, it also generates a P-256 [FIPS186] key pair for use in ECDH [ECDH].
- note to self: I have this in the "PushSubscription" 

When sending a push message, the application server also generates a new ECDH key pair on the same P-256 curve.
- note to self: this is just generateECDHkey()


The ECDH public key for the application server is included as the
   "keyid" parameter in the encrypted content coding header (see [RFC8188] https://www.rfc-editor.org/rfc/rfc8188.html#section-2.1

- salt (16) | rs (4) | idlen (1) | keyid (idlen)

An application server combines its ECDH private key with the public key provided by the user agent "according to ECDH spec...."
   - in english: combine(appserverPrivateKey, useragentPublicKey)

   on receipt of the push message, a user agent combines its private key with the public key provided by the application server in the "keyid"
   parameter in the same way.
   - in english: I prob dont need to care about this 
   - (except give the pushsubscription the appServerPublicKey on initial pushManager.subscribe())
  
  anyway: "These operations produce the same value for the ECDH shared secret."

*/

async function encryptedContentCodingHeader() {
  const { privateKeyBuffer, publicKeyBuffer } = await generateECDHkey();

  const salt = generateSalt();
  const rs = generateRs(); //TODO, this should be the lenght of record... read in bytes I assume

  const idlen = new Uint8Array([publicKeyBuffer.byteLength]);
  const keyId = new Uint8Array(publicKeyBuffer);

  console.log({
    salt,
    rs,
    idlen,
    keyId,
  });
  //const result = Buffer.concat([salt, rs, header.keyId]);

  const res = new Uint8Array([...salt, ...rs, ...idlen, ...keyId]);
  console.log(res);
}

function generateSalt() {
  const v = new Uint8Array(16);
  return crypto.getRandomValues(v);
}

/*
The "rs" or record size parameter contains an unsigned 32-bit
integer in network byte order that describes the record size in
octets.  Note that it is, therefore, impossible to exceed the
2^36-31 limit on plaintext input to AEAD_AES_128_GCM.  Values
smaller than 18 are invalid.
*/
function generateRs() {
  const v = new Uint32Array([4096]);
  return new Uint8Array(v.buffer);
}
