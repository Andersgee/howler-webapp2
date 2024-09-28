/**
 * # HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
 *
 * [rfc5869](https://datatracker.ietf.org/doc/html/rfc5869)
 *
 * # Combining Shared and Authentication Secrets
 *
 * [rfc8291#section-3.3](https://datatracker.ietf.org/doc/html/rfc8291#section-3.3)
 *
 * The HKDF function uses the SHA-256 hash algorithm [FIPS180-4] with the following inputs:
 *
 * salt: the authentication secret
 *
 * IKM:  the shared secret derived using ECDH
 *
 * info: "WebPush: info" || 0x00 || ua_public || as_public
 *
 * L:  32 octets (i.e., the output is the length of the underlying SHA-256 HMAC function output)
 *
 */
export async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, lenght = 32) {
  const prk = await hkdf_extract(salt, ikm);
  const okm = await hkdf_expand(prk, info, lenght);
  return { prk, okm };
}

//https://datatracker.ietf.org/doc/html/rfc5869#section-2.2
export async function hkdf_extract(salt: Uint8Array, ikm: Uint8Array) {
  const prk = await hmacSHA256(salt, ikm);
  return prk;
}

//https://datatracker.ietf.org/doc/html/rfc5869#section-2.3
export async function hkdf_expand(prk: Uint8Array, info: Uint8Array, length: number) {
  //simplified if length <= 32 since hmachash is always 32 bytes
  const T = await hmacSHA256(prk, new Uint8Array([...info, 1]));
  const okm = T.slice(0, length);
  return okm;
}

export async function hmacSHA256(secret: Uint8Array, data: Uint8Array) {
  const key = await crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    secret,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false, // export = false
    ["sign", "verify"] // what this key can do
  );

  const buf = await crypto.subtle.sign("HMAC", key, data);

  return new Uint8Array(buf);
}

/*
N = ceil(L/HashLen)
T = T(1) | T(2) | T(3) | ... | T(N)
OKM = first L octets of T

where:
T(0) = empty string (zero length)
T(1) = HMAC-Hash(PRK, T(0) | info | 0x01)
T(2) = HMAC-Hash(PRK, T(1) | info | 0x02)
T(3) = HMAC-Hash(PRK, T(2) | info | 0x03)
*/
/*
export async function hkdf_expand_proper(prk: Uint8Array, info: Uint8Array, length: number) {
  let okm = new Uint8Array(0);
  let T = new Uint8Array(0);
  let counter = 0;

  while (okm.length < length) {
    counter = counter + 1;
    const r = new Uint8Array([...T, ...info, counter]);
    T = await hmachash(prk, r);
    okm = new Uint8Array([...okm, ...T]);
  }

  return okm.slice(0, length);
}
*/
