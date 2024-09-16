import * as crypto from "node:crypto";

//typed version of the part of http_ece that relates to
//encrypting a request body for Content-Encoding: "aes128gcm"

const KEY_LENGTH = 16;
const TAG_LENGTH = 16;
const SHA_256_LENGTH = 32;
const NONCE_LENGTH = 12;

type Params = {
  /** this is our servers key pair, generated with crypto.createECDH("prime256v1") */
  privateKey: crypto.ECDH;
  /** this is the  clients pushsubscription.getKey("p256dh") in base64url form */
  dh: string;
  /** this is the clients pushsubscription.getKey("auth") in base64url form */
  authSecret: string;
};

export function encrypt(buffer: Buffer, params: Params) {
  const header = {
    version: "aes128gcm",
    rs: 4096,
    privateKey: params.privateKey,
    dh: Buffer.from(params.dh, "base64url"),
    authSecret: Buffer.from(params.authSecret, "base64url"),
    salt: crypto.randomBytes(KEY_LENGTH),
    keyId: params.privateKey.getPublicKey(),
  };

  const ints = Buffer.alloc(5);
  ints.writeUIntBE(header.rs, 0, 4);
  ints.writeUIntBE(header.keyId.length, 4, 1);
  let result = Buffer.concat([header.salt, ints, header.keyId]);

  const key = deriveKeyAndNonce(header);
  let start = 0;
  const padSize = 1;
  let overhead = padSize;
  overhead += TAG_LENGTH;

  let pad = 0;
  let counter = 0;
  let last = false;
  while (!last) {
    // Pad so that at least one data byte is in a block.
    let recordPad = Math.min(header.rs - overhead - 1, pad);

    if (pad > 0 && recordPad === 0) {
      ++recordPad; // Deal with perverse case of rs=overhead+1 with padding.
    }
    pad -= recordPad;
    const end = start + header.rs - overhead - recordPad;
    last = end >= buffer.length;
    last = last && pad <= 0;
    const block = encryptRecord(key, counter, buffer.slice(start, end), recordPad, header, last);
    result = Buffer.concat([result, block]);

    start = end;
    ++counter;
  }
  return result;
}

function HKDF_expand(prk: Buffer, info: Buffer, l: number) {
  let output = Buffer.alloc(0);
  let T = Buffer.alloc(0);
  //info = Buffer.from(info, "ascii");
  let counter = 0;
  const cbuf = Buffer.alloc(1);
  while (output.length < l) {
    cbuf.writeUIntBE(++counter, 0, 1);
    T = HMAC_hash(prk, Buffer.concat([T, info, cbuf]));
    output = Buffer.concat([output, T]);
  }

  return output.slice(0, l);
}

function HMAC_hash(key: Buffer, input: Buffer) {
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(input);
  return hmac.digest();
}

/* HKDF as defined in RFC5869, using SHA-256 */
function HKDF_extract(salt: Buffer, ikm: Buffer) {
  return HMAC_hash(salt, ikm);
}

function HKDF(salt: Buffer, ikm: Buffer, info: Buffer, len: number) {
  return HKDF_expand(HKDF_extract(salt, ikm), info, len);
}

function deriveKeyAndNonce(header: {
  version: string;
  rs: number;
  privateKey: crypto.ECDH;
  dh: Buffer;
  authSecret: Buffer;
  salt: Buffer;
  keyId: Buffer;
}) {
  // latest
  const keyInfo = Buffer.from("Content-Encoding: aes128gcm\0");
  const nonceInfo = Buffer.from("Content-Encoding: nonce\0");
  //const secret = extractSecret(header, mode);

  const senderPubKey = header.privateKey.getPublicKey();
  const remotePubKey = header.dh;

  const secret = HKDF(
    header.authSecret,
    header.privateKey.computeSecret(remotePubKey),
    Buffer.concat([Buffer.from("WebPush: info\0"), remotePubKey, senderPubKey]),
    SHA_256_LENGTH
  );

  const prk = HKDF_extract(header.salt, secret);
  const result = {
    key: HKDF_expand(prk, keyInfo, KEY_LENGTH),
    nonce: HKDF_expand(prk, nonceInfo, NONCE_LENGTH),
  };

  return result;
}

function generateNonce(base: Buffer, counter: number) {
  const nonce = Buffer.from(base);
  const m = nonce.readUIntBE(nonce.length - 6, 6);
  const x = ((m ^ counter) & 0xffffff) + (((m / 0x1000000) ^ (counter / 0x1000000)) & 0xffffff) * 0x1000000;
  nonce.writeUIntBE(x, nonce.length - 6, 6);
  return nonce;
}

function encryptRecord(
  key: {
    key: Buffer;
    nonce: Buffer;
  },
  counter: number,
  buffer: Buffer,
  pad: number,
  header: {
    version: string;
    rs: number;
    privateKey: crypto.ECDH;
    dh: Buffer;
    authSecret: Buffer;
    salt: Buffer;
    keyId: Buffer;
  },
  last: boolean
) {
  const nonce = generateNonce(key.nonce, counter);
  const gcm = crypto.createCipheriv("aes-128-gcm", key.key, nonce);

  const ciphertext = [];
  const padSize = 1;
  const padding = Buffer.alloc(pad + padSize);
  padding.fill(0);

  ciphertext.push(gcm.update(buffer));
  padding.writeUIntBE(last ? 2 : 1, 0, 1);
  ciphertext.push(gcm.update(padding));

  gcm.final();
  const tag = gcm.getAuthTag();
  if (tag.length !== TAG_LENGTH) {
    throw new Error("invalid tag generated");
  }
  ciphertext.push(tag);
  return Buffer.concat(ciphertext);
}
