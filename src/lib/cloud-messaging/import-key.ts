//https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#pkcs_8_import

import { base64 } from "rfc4648";

/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/*
Import a PEM encoded RSA private key, to use for RSA-PSS signing.
Takes a string containing the PEM encoded key, and returns a Promise
that will resolve to a CryptoKey representing the private key.
*/
export async function importPrivateKey(pem: string) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length - 1);
  // base64 decode the string to get the binary data
  const binaryDerString = atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);
  //const binaryDer = base64.parse(pemContents);

  //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", //format
    binaryDer, //data
    {
      //algorithm, https://developer.mozilla.org/en-US/docs/Web/API/RsaHashedImportParams
      //name: "RSA-PSS",
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"] //allowed usages
  );

  return cryptoKey;
}
