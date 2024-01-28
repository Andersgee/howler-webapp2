import type { BatchResponse } from "firebase-admin/messaging";

/**
 * try to follow best pracices for fcmToken management
 * @see [manage-tokens](https://firebase.google.com/docs/cloud-messaging/manage-tokens#detect-invalid-token-responses-from-the-fcm-backend).
 *
 * honestly docs messy... this list copy pasted from [github.com/firebase/firebase-admin-node](https://github.com/firebase/firebase-admin-node/blob/master/src/utils/error.ts)
 * but added "messaging/" in front of codes since FirebaseError docstring sais format is like this: "service/string-code" eg. "messaging/invalid-recipient"
 *
 * ## checking for responses when sending messages
 * supposed to atleast check for `INVALID_ARGUMENT` and UNREGISTERED (aka `REGISTRATION_TOKEN_NOT_REGISTERED`)
 *
 */
export const FIREBASE_MESSAGING_ERROR_CODES = {
  INVALID_ARGUMENT: "messaging/invalid-argument",
  INVALID_RECIPIENT: "messaging/invalid-recipient",
  INVALID_PAYLOAD: "messaging/invalid-payload",
  INVALID_DATA_PAYLOAD_KEY: "messaging/invalid-data-payload-key",
  PAYLOAD_SIZE_LIMIT_EXCEEDED: "messaging/payload-size-limit-exceeded",
  INVALID_OPTIONS: "messaging/invalid-options",
  INVALID_REGISTRATION_TOKEN: "messaging/invalid-registration-token",
  REGISTRATION_TOKEN_NOT_REGISTERED: "messaging/registration-token-not-registered",
  MISMATCHED_CREDENTIAL: "messaging/mismatched-credential",
  INVALID_PACKAGE_NAME: "messaging/invalid-package-name",
  DEVICE_MESSAGE_RATE_EXCEEDED: "messaging/device-message-rate-exceeded",
  TOPICS_MESSAGE_RATE_EXCEEDED: "messaging/topics-message-rate-exceeded",
  MESSAGE_RATE_EXCEEDED: "messaging/message-rate-exceeded",
  THIRD_PARTY_AUTH_ERROR: "messaging/third-party-auth-error",
  TOO_MANY_TOPICS: "messaging/too-many-topics",
  AUTHENTICATION_ERROR: "messaging/authentication-error",
  SERVER_UNAVAILABLE: "messaging/server-unavailable",
  INTERNAL_ERROR: "messaging/internal-error",
  UNKNOWN_ERROR: "messaging/unknown-error",
};

export function getStaleFcmtokens(fcmTokens: string[], batchResponse: BatchResponse) {
  if (batchResponse.failureCount === 0) return [];

  const BAD_TOKEN_CODES = [
    FIREBASE_MESSAGING_ERROR_CODES.REGISTRATION_TOKEN_NOT_REGISTERED,
    FIREBASE_MESSAGING_ERROR_CODES.INVALID_RECIPIENT,
  ];

  const BAD_FORMATTING_CODES = [
    FIREBASE_MESSAGING_ERROR_CODES.INVALID_ARGUMENT,
    FIREBASE_MESSAGING_ERROR_CODES.INVALID_PAYLOAD,
  ];

  const isStaleTokenList = batchResponse.responses.map((response) => {
    if (response.success) return false;

    const code = response.error?.code;
    response.error?.message;
    if (!code) return false;

    if (BAD_FORMATTING_CODES.includes(code)) {
      console.log("bad formatting, fcm response error code:", code);
      //this is not stale, prob just issue with the payload we sent
      return false;
    }

    if (BAD_TOKEN_CODES.includes(code)) {
      //delete bad tokens (invalid or stale)
      return true;
    }
    console.log("(didnt check for this explicitly) fcm response error code:", code);
    return false;
  });

  const staleFcmTokens = fcmTokens.filter((_, i) => isStaleTokenList[i]);
  return staleFcmTokens;
}
