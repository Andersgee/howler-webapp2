/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { zGeoJson } from "./types-geojson";

const zTypedArray = z.custom<Uint8Array>((value) => value instanceof Uint8Array);

// this file here mostly generated as a copy-paste starting point reference for when specifying api inputs
// anyway, this is how values of "INSERT" and "UPDATE" looks from a zod perspective

export const schema_insert_CloudMessageAccessToken = z.object({
  id: z.bigint(),
  token: z.string(),
  expires: z.date(),
});
export const schema_update_CloudMessageAccessToken = z.object({
  id: z.bigint().optional(),
  token: z.string().optional(),
  expires: z.date().optional(),
});

export const schema_insert_UserUserPivot = z.object({
  userId: z.bigint(),
  followerId: z.bigint(),
  createdAt: z.date().optional(),
});
export const schema_update_UserUserPivot = z.object({
  userId: z.bigint().optional(),
  followerId: z.bigint().optional(),
  createdAt: z.date().optional(),
});

export const schema_insert_UserPackPivot = z.object({
  userId: z.bigint(),
  packId: z.bigint(),
  createdAt: z.date().optional(),
  role: z.enum(["CREATOR","ADMIN","MEMBER"]).optional(),
});
export const schema_update_UserPackPivot = z.object({
  userId: z.bigint().optional(),
  packId: z.bigint().optional(),
  createdAt: z.date().optional(),
  role: z.enum(["CREATOR","ADMIN","MEMBER"]).optional(),
});

export const schema_insert_UserNotificationPivot = z.object({
  userId: z.bigint(),
  notificationId: z.bigint(),
});
export const schema_update_UserNotificationPivot = z.object({
  userId: z.bigint().optional(),
  notificationId: z.bigint().optional(),
});

export const schema_insert_UserEventPivot = z.object({
  userId: z.bigint(),
  eventId: z.bigint(),
  joinDate: z.date().optional(),
});
export const schema_update_UserEventPivot = z.object({
  userId: z.bigint().optional(),
  eventId: z.bigint().optional(),
  joinDate: z.date().optional(),
});

export const schema_insert_User = z.object({
  id: z.bigint().optional(),
  email: z.string(),
  googleUserSub: z.string().nullish(),
  discordUserId: z.string().nullish(),
  githubUserId: z.number().nullish(),
  image: z.string().nullish(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(["USER","ADMIN"]).optional(),
  facebookdUserId: z.string().nullish(),
});
export const schema_update_User = z.object({
  id: z.bigint().optional(),
  email: z.string().optional(),
  googleUserSub: z.string().nullish(),
  discordUserId: z.string().nullish(),
  githubUserId: z.number().nullish(),
  image: z.string().nullish(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(["USER","ADMIN"]).optional(),
  facebookdUserId: z.string().nullish(),
});

export const schema_insert_Reply = z.object({
  id: z.bigint().optional(),
  userId: z.bigint(),
  commentId: z.bigint(),
  text: z.string(),
  createdAt: z.date().optional(),
});
export const schema_update_Reply = z.object({
  id: z.bigint().optional(),
  userId: z.bigint().optional(),
  commentId: z.bigint().optional(),
  text: z.string().optional(),
  createdAt: z.date().optional(),
});

export const schema_insert_PushSubscription = z.object({
  userId: z.bigint(),
  auth_base64url: z.string(),
  p256dh_base64url: z.string(),
  endpoint: z.string(),
});
export const schema_update_PushSubscription = z.object({
  userId: z.bigint().optional(),
  auth_base64url: z.string().optional(),
  p256dh_base64url: z.string().optional(),
  endpoint: z.string().optional(),
});

export const schema_insert_Post = z.object({
  id: z.bigint().optional(),
  text: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.bigint(),
});
export const schema_update_Post = z.object({
  id: z.bigint().optional(),
  text: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.bigint().optional(),
});

export const schema_insert_Pack = z.object({
  id: z.bigint().optional(),
  title: z.string(),
  image: z.string().nullish(),
  creatorId: z.bigint(),
});
export const schema_update_Pack = z.object({
  id: z.bigint().optional(),
  title: z.string().optional(),
  image: z.string().nullish(),
  creatorId: z.bigint().optional(),
});

export const schema_insert_Notification = z.object({
  id: z.bigint().optional(),
  title: z.string(),
  body: z.string(),
  relativeLink: z.string(),
  createdAt: z.date().optional(),
});
export const schema_update_Notification = z.object({
  id: z.bigint().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  relativeLink: z.string().optional(),
  createdAt: z.date().optional(),
});

export const schema_insert_FcmToken = z.object({
  token: z.string(),
  userId: z.bigint(),
});
export const schema_update_FcmToken = z.object({
  token: z.string().optional(),
  userId: z.bigint().optional(),
});

export const schema_insert_Event = z.object({
  id: z.bigint().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string(),
  date: z.date().optional(),
  location: zGeoJson.Point.nullish(),
  locationName: z.string().nullish(),
  creatorId: z.bigint(),
  image: z.string().nullish(),
  imageBlurData: zTypedArray.nullish(),
  imageAspect: z.number().optional(),
  pinnedCommentId: z.bigint().nullish(),
});
export const schema_update_Event = z.object({
  id: z.bigint().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string().optional(),
  date: z.date().optional(),
  location: zGeoJson.Point.nullish(),
  locationName: z.string().nullish(),
  creatorId: z.bigint().optional(),
  image: z.string().nullish(),
  imageBlurData: zTypedArray.nullish(),
  imageAspect: z.number().optional(),
  pinnedCommentId: z.bigint().nullish(),
});

export const schema_insert_DeletedEventImages = z.object({
  image: z.string(),
});
export const schema_update_DeletedEventImages = z.object({
  image: z.string().optional(),
});

export const schema_insert_Comment = z.object({
  id: z.bigint().optional(),
  userId: z.bigint(),
  eventId: z.bigint(),
  text: z.string(),
  createdAt: z.date().optional(),
});
export const schema_update_Comment = z.object({
  id: z.bigint().optional(),
  userId: z.bigint().optional(),
  eventId: z.bigint().optional(),
  text: z.string().optional(),
  createdAt: z.date().optional(),
});

