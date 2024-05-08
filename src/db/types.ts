/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Generated } from "kysely";
import type { GeoJson } from "./types-geojson";
  
export type DB = {
  CloudMessageAccessToken: CloudMessageAccessToken;
  UserUserPivot: UserUserPivot;
  UserNotificationPivot: UserNotificationPivot;
  UserEventPivot: UserEventPivot;
  User: User;
  Reply: Reply;
  Post: Post;
  Notification: Notification;
  FcmToken: FcmToken;
  Event: Event;
  Comment: Comment;
  DeletedEventImages: DeletedEventImages;
};

export type CloudMessageAccessToken = {
  /** indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: bigint;
  /** dbtype: 'varchar(2000)', eg string with max 2000 chars */
  token: string;
  /** dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  expires: Date;
};

export type Comment = {
  /** default: autoincrement(), indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: Generated<bigint>;
  /** indexed: (userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
  /** indexed: (eventId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  eventId: bigint;
  /** dbtype: 'varchar(280)', eg string with max 280 chars */
  text: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
};

export type DeletedEventImages = {
  /** indexed: (image), dbtype: 'varchar(100)', eg string with max 100 chars */
  image: string;
};

export type Event = {
  /** default: autoincrement(), indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: Generated<bigint>;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  updatedAt: Generated<Date>;
  /** indexed: (title, locationName), dbtype: 'varchar(55)', eg string with max 55 chars */
  title: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  date: Generated<Date>;
  /** dbtype: 'point' */
  location: GeoJson["Point"] | null;
  /** indexed: (title, locationName), dbtype: 'varchar(55)', eg string with max 55 chars */
  locationName: string | null;
  /** indexed: (creatorId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  creatorId: bigint;
  /** dbtype: 'varchar(100)', eg string with max 100 chars */
  image: string | null;
  /** dbtype: 'varbinary(255)', eg bytes with max 255 bytes */
  imageBlurData: Uint8Array | null;
  /** default: 1, dbtype: 'float' */
  imageAspect: Generated<number>;
  /** dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  pinnedCommentId: bigint | null;
};

export type FcmToken = {
  /** indexed: (token), dbtype: 'varchar(200)', eg string with max 200 chars */
  token: string;
  /** indexed: (userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
};

export type Notification = {
  /** default: autoincrement(), indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: Generated<bigint>;
  /** dbtype: 'varchar(55)', eg string with max 55 chars */
  title: string;
  /** dbtype: 'varchar(55)', eg string with max 55 chars */
  body: string;
  /** dbtype: 'varchar(55)', eg string with max 55 chars */
  relativeLink: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
};

export type Post = {
  /** default: autoincrement(), indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: Generated<bigint>;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  text: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  updatedAt: Generated<Date>;
  /** indexed: (userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
};

export type Reply = {
  /** default: autoincrement(), indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: Generated<bigint>;
  /** indexed: (userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
  /** indexed: (commentId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  commentId: bigint;
  /** dbtype: 'varchar(280)', eg string with max 280 chars */
  text: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
};

export type User = {
  /** default: autoincrement(), indexed: (id), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  id: Generated<bigint>;
  /** indexed: (email), dbtype: 'varchar(191)', eg string with max 191 chars */
  email: string;
  /** indexed: (googleUserSub), dbtype: 'varchar(191)', eg string with max 191 chars */
  googleUserSub: string | null;
  /** indexed: (discordUserId), dbtype: 'varchar(191)', eg string with max 191 chars */
  discordUserId: string | null;
  /** indexed: (githubUserId), dbtype: 'int' eg number in range [-2_147_483_648, 2_147_483_647] */
  githubUserId: number | null;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  image: string | null;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  name: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  updatedAt: Generated<Date>;
  /** default: USER, dbtype: 'enum('USER','ADMIN')' */
  role: Generated<"USER" | "ADMIN">;
  /** indexed: (facebookdUserId), dbtype: 'varchar(191)', eg string with max 191 chars */
  facebookdUserId: string | null;
};

export type UserEventPivot = {
  /** indexed: (eventId, userId) and (userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
  /** indexed: (eventId, userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  eventId: bigint;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  joinDate: Generated<Date>;
};

export type UserNotificationPivot = {
  /** indexed: (userId, notificationId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
  /** indexed: (userId, notificationId) and (notificationId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  notificationId: bigint;
};

export type UserUserPivot = {
  /** indexed: (userId, followerId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
  /** indexed: (userId, followerId) and (followerId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  followerId: bigint;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
};

