import * as crypto from "node:crypto";
import { encrypt } from "./ece";

function hmm(p: PushSubscription) {
  const auth = p.getKey("auth");
  const userPublicKey = p.getKey("p256dh");
}

//const crypto = require("crypto");
//const ece = require("http_ece");

function aes128gcm_encrypt(
  subscription_keys_p256dh_b64url: string,
  subscription_keys_auth_b64url: string,
  strpayload: string
) {
  /*
  if (!subscription_keys_p256dh_b64url) {
    throw new Error('No user public key provided for encryption.');
  }

  if (typeof subscription_keys_p256dh_b64url !== 'string') {
    throw new Error('The subscription p256dh value must be a string.');
  }

  if (Buffer.from(subscription_keys_p256dh_b64url, 'base64url').length !== 65) {
    throw new Error('The subscription p256dh value should be 65 bytes long.');
  }

  if (!subscription_keys_auth_b64url) {
    throw new Error('No user auth provided for encryption.');
  }

  if (typeof subscription_keys_auth_b64url !== 'string') {
    throw new Error('The subscription auth key must be a string.');
  }
  if (Buffer.from(subscription_keys_auth_b64url, 'base64url').length < 16) {
    throw new Error('The subscription auth key should be at least 16 '
    + 'bytes long');
  }
  
  if (typeof payload !== 'string' && !Buffer.isBuffer(payload)) {
    throw new Error('Payload must be either a string or a Node Buffer.');
  }
  */

  //if (typeof payload === "string" || payload instanceof String) {
  //}
  const payload = Buffer.from(strpayload);

  const localCurve = crypto.createECDH("prime256v1");
  const localPublicKey = localCurve.generateKeys();

  const salt = crypto.randomBytes(16).toString("base64url");

  const cipherText = encrypt(payload, {
    version: "aes128gcm",
    dh: subscription_keys_p256dh_b64url,
    privateKey: localCurve,
    salt: salt,
    authSecret: subscription_keys_auth_b64url,
  });

  return {
    localPublicKey: localPublicKey,
    salt: salt,
    cipherText: cipherText,
  };
}
