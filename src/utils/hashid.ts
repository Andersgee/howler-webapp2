import Hashids from "hashids";

const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SALT, 5);

//note to self:
//hashids can handle encode from bigint
//but it will never decode to bigint (even though they say the support bigint and return type of decode is "number | bigint")
//anyway, "hashids" is apparently deprecated in favor of "sqids"
//but "sqids" does not either encode or decode with bigint
//issue here: https://github.com/sqids/sqids-javascript/issues/4

export function hashidFromId(n: bigint) {
  return hashids.encode(n);
}

export function idFromHashid(s: string) {
  const decoded = hashids.decode(s);
  if (decoded[0] === undefined) {
    return undefined;
  }
  return BigInt(decoded[0]);
}

export function idFromHashidOrThrow(s: string) {
  const decoded = hashids.decode(s);
  if (decoded[0] === undefined) {
    throw new Error("bad hashid");
  }
  return BigInt(decoded[0]);
}
