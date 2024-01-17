import type { Generated } from "kysely";
import type { GeoJSON } from "./geojson-types";
  
export type DB = {
  UserEventPivot: UserEventPivot;
  Event: Event;
  User: User;
  Post: Post;
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
  location: GeoJSON["Point"] | null;
  /** indexed: (creatorId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  creatorId: bigint;
  /** indexed: (title, locationName), dbtype: 'varchar(55)', eg string with max 55 chars */
  locationName: string | null;
  /** dbtype: 'varchar(100)', eg string with max 100 chars */
  image: string | null;
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
};

export type UserEventPivot = {
  /** indexed: (eventId, userId) and (userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  userId: bigint;
  /** indexed: (eventId, userId), dbtype: 'bigint unsigned' eg number in range [0, 2^64-1] */
  eventId: bigint;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  joinDate: Generated<Date>;
};

