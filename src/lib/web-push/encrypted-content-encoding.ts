/**
 * # Encrypted Content-Encoding for HTTP
 *
 * [rfc8188](https://datatracker.ietf.org/doc/html/rfc8188#section-2)
 *
 * ## notes
 *
 * A push service is not required to support more than 4096 octets of payload body
 * absent header (86 octets), padding (minimum 1 octet), and expansion for AEAD_AES_128_GCM (16 octets),
 * this equates to, at most, 3993 octets of plaintext.
 */
export async function contentEncrypt(data: Uint8Array, cek: Uint8Array, nonce: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
      //additionalData: ?,
      tagLength: 128,
    },
    key,
    data
  );
  return new Uint8Array(encrypted);
}

/**
 *
 * # Encryption Content-Coding Header
 *
 * [rfc8188 section 2.1](https://datatracker.ietf.org/doc/html/rfc8188#section-2.1)
 *
 * ## notes
 *
 * The "aes128gcm" content coding uses a fixed record size.  The final encoding consists of a header and zero or more
 * fixed-size encrypted records; the final record can be smaller than the record size.
 *
 * TLDR; just put rs=4096 and its fine, since only one record is allowed anyway so it is indeed last.
 *
 */
export function contentCodingHeader(salt: Uint8Array, as_public: Uint8Array) {
  const rs = new Uint8Array([0, 0, 16, 0]); //4096 in network byte order
  const header = new Uint8Array([
    ...salt, //salt
    ...rs, //rs
    as_public.length, //idlen
    ...as_public, //keyid
  ]);
  return header;
}
