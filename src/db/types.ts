import type { Generated } from "kysely";
import type { GeoJSON } from "./geojson-types";
  
export type DB = {
  Post: Post;
  User: User;
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

