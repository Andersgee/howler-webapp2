import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";
import { generateSharedECDHSecret, keyimport_ECDH_raw_as_cryptokey } from "./keys/ecdh";
import { make_private_cryptokey_from_raw_ECDH_pair } from "./keys/hack";
import { hkdf, hkdf_expand } from "./hmac/hkdf";
import { generateCekInfo, generateInfo, generateNonceInfo, uint8ArrayFromString } from "./utils";
import { contentCodingHeader, contentEncrypt } from "./encrypted-content-encoding";

/*
the  #Push Message Encryption Example - https://datatracker.ietf.org/doc/html/rfc8291#section-5

has a walkthrough a bit lower down - https://datatracker.ietf.org/doc/html/rfc8291#appendix-A

lets try to reproduce that

btw that example only describes what "values" to use for encryption
The payload actual encryption is described here: https://datatracker.ietf.org/doc/html/rfc8188#section-2.3
*/

async function main() {
  const payload = "When I grow up, I want to be a watermelon";

  //these thins are generated on Pushsubscription.subscribe()
  //const ua_private = "q1dXpw3UpT5VOmu_cf_v6ih07Aems3njxI-JWgLcM94";
  const ua_public = "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4"; //available at pushSubscription.getKey("p256dh")
  const auth_secret = "BTBZMqHH6r4Tts7J_aSIgg"; // 16 bytes, ua_salt, available at pushSubscription.getKey("auth")

  //these I would generate myself (ECDH)
  const as_public = "BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8"; //65 bytes
  const as_private = "yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw"; //32 bytes,

  const salt = "DGv6ra1nlYgDCS1FRnbzlw"; // as_salt (just 16 random bytes)

  //For reproduction purpose, read keys as CryptoKey's etc
  const as_private_cryptokey = await make_private_cryptokey_from_raw_ECDH_pair(
    uint8ArrayFromBase64url(as_private),
    uint8ArrayFromBase64url(as_public)
  );
  //const as_public_cryptokey = await keyimport_ECDH_raw_as_cryptokey(as_public);
  const as_public_uint8array = uint8ArrayFromBase64url(as_public);
  const ua_public_cryptokey = await keyimport_ECDH_raw_as_cryptokey(ua_public);
  const salt_uint8array = uint8ArrayFromBase64url(salt);
  const auth_secret_uint8array = uint8ArrayFromBase64url(auth_secret);

  //intermediate values

  //info "Info for key combining"
  const info_EXPECTED =
    "V2ViUHVzaDogaW5mbwAEJXGyvs3942BVGq8e0PTNNmwRzr5VX4m8t7GGpTM5FzFo7OLr4BhZe9MEebhuPI-OztV3ylkYfpJGmQ22ggCLDgT-M_SrDepxkU21WCP3O1SUj0EwbZIHMtu5pZpTKGSCIA5Zent7wmC6HCJ5mFgJkuk5cwAvMBKiiujwa7t45ewP";
  const info = generateInfo(ua_public, as_public);

  if (base64urlFromUint8Array(info) !== info_EXPECTED) {
    console.log("INCORRECT: generateInfo()");
  }

  //ecdh_secret "Shared ECDH secret"
  const ecdh_secret_EXPECTED = "kyrL1jIIOHEzg3sM2ZWRHDRB62YACZhhSlknJ672kSs"; //shared ECDH secret
  const ecdh_secret = await generateSharedECDHSecret(as_private_cryptokey, ua_public_cryptokey);

  if (base64urlFromUint8Array(ecdh_secret) !== ecdh_secret_EXPECTED) {
    console.log("INCORRECT: generateSharedECDHSecret()");
  }

  const ikm_EXPECTED = "S4lYMb_L0FxCeq0WhDx813KgSYqU26kOyzWUdsXYyrg"; //32 bytes
  const prk_key_EXPECTED = "Snr3JMxaHVDXHWJn5wdC52WjpCtd2EIEGBykDcZW32k";

  const { prk: prk_key, okm: ikm } = await hkdf(auth_secret_uint8array, ecdh_secret, info, 32);

  if (base64urlFromUint8Array(ikm) !== ikm_EXPECTED) {
    console.log("INCORRECT: hkdf(), okm");
  }

  if (base64urlFromUint8Array(prk_key) !== prk_key_EXPECTED) {
    console.log("INCORRECT: hkdf(), prk");
  }

  const cek_info_EXPECTED = "Q29udGVudC1FbmNvZGluZzogYWVzMTI4Z2NtAA";
  const cek_info = generateCekInfo();
  if (base64urlFromUint8Array(cek_info) !== cek_info_EXPECTED) {
    console.log("INCORRECT: cek_info");
  }

  const prk_EXPECTED = "09_eUZGrsvxChDCGRCdkLiDXrReGOEVeSCdCcPBSJSc";
  const cek_EXPECTED = "oIhVW04MRdy2XN9CiKLxTg";

  const { prk, okm: cek } = await hkdf(salt_uint8array, ikm, cek_info, 16);

  if (base64urlFromUint8Array(prk) !== prk_EXPECTED) {
    console.log("INCORRECT: prk");
  }
  if (base64urlFromUint8Array(cek) !== cek_EXPECTED) {
    console.log("INCORRECT: cek");
  }

  const nonce_info_EXPECTED = "Q29udGVudC1FbmNvZGluZzogbm9uY2UA";
  const nonce_info = generateNonceInfo();

  if (base64urlFromUint8Array(nonce_info) !== nonce_info_EXPECTED) {
    console.log("INCORRECT: nonce_info");
  }

  const nonce_EXPECTED = "4h_95klXJ5E_qnoN";

  //nonce derivation.. https://datatracker.ietf.org/doc/html/rfc8188#section-2.3
  const nonce = await hkdf_expand(prk, nonce_info, 12);
  if (base64urlFromUint8Array(nonce) !== nonce_EXPECTED) {
    console.log("INCORRECT: nonce");
  }

  const header_EXPECTED =
    "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8";

  const header = contentCodingHeader(salt_uint8array, as_public_uint8array);

  if (base64urlFromUint8Array(header) !== header_EXPECTED) {
    console.log("INCORRECT: header");
  }

  const plaintext_EXPECTED = "V2hlbiBJIGdyb3cgdXAsIEkgd2FudCB0byBiZSBhIHdhdGVybWVsb24";
  const plaintext = uint8ArrayFromString(payload);
  if (base64urlFromUint8Array(plaintext) !== plaintext_EXPECTED) {
    console.log("INCORRECT: plaintext");
  }

  //restriction, plaintext.length must be 3993 or less
  //also they should be ascii not utf8 like Ive done
  //but I think handle that outside with some helper / replacer
  //actually the keyId SHOULD be utf8

  const plaintext_padded_EXPECTED = "V2hlbiBJIGdyb3cgdXAsIEkgd2FudCB0byBiZSBhIHdhdGVybWVsb24C";
  const plaintext_padded = new Uint8Array([...plaintext, 2]); //with the "single-octet padding delimiter" (last record has "2" all others have "1" but we only have one record so it is indeed last)
  if (base64urlFromUint8Array(plaintext_padded) !== plaintext_padded_EXPECTED) {
    console.log("INCORRECT: plaintext_padded");
  }

  const ciphertext_EXPECTED = "8pfeW0KbunFT06SuDKoJH9Ql87S1QUrdirN6GcG7sFz1y1sqLgVi1VhjVkHsUoEsbI_0LpXMuGvnzQ";

  const ciphertext = await contentEncrypt(plaintext_padded, cek, nonce);

  if (base64urlFromUint8Array(ciphertext) !== ciphertext_EXPECTED) {
    console.log("INCORRECT: ciphertext");
  }

  const body_EXPECTED =
    "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN";
  const body = new Uint8Array([...header, ...ciphertext]);

  if (base64urlFromUint8Array(body) !== body_EXPECTED) {
    console.log("INCORRECT: body");
  }

  return 1;
}

void main();
