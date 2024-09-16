import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import * as crypto from "node:crypto";

function encrypt(text: string, key: string) {
  const cipherKey = Buffer.from(key, "hex");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-128-gcm", cipherKey, iv);
  const res = Buffer.concat([iv, cipher.update(text), cipher.final(), cipher.getAuthTag()]);
  return res.toString("base64");
}

function decrypt(inputx: string | Buffer, key: string) {
  const input = inputx instanceof Buffer ? inputx : Buffer.from(inputx, "base64");
  const tag = input.slice(input.length - 16, input.length);
  const iv = input.slice(0, 12);
  const toDecrypt = input.slice(12, input.length - tag.length);

  const cipherKey = Buffer.from(key, "hex");
  const decipher = crypto.createDecipheriv("aes-128-gcm", cipherKey, iv);
  decipher.setAuthTag(tag);

  const res = Buffer.concat([decipher.update(toDecrypt), decipher.final()]);
  return res.toString("utf8");
}

//const key = "12f41deed45188c8061c840c643baede";
const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY_B64URL;
const encrypted = encrypt(
  "Why then 'tis none to you; for there is nothing either good or bad, but thinking makes it so.",
  key
);

console.log("Encrypted data:", encrypted);
console.log("Decrypted:", decrypt(encrypted, key));
