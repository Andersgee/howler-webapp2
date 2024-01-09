import Hashids from "hashids";

const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SALT, 5);

export function hashidFromId(n: number) {
  const a = hashids.encode(n);
  return a;
}

export function idFromHashid(s: string) {
  const decoded = hashids.decode(s);
  return decoded[0] as number | undefined;
}

export function idFromHashidOrThrow(s: string) {
  const decoded = hashids.decode(s);
  if (decoded[0] === undefined) {
    throw new Error("bad hashid");
  }
  return decoded[0] as number;
}
