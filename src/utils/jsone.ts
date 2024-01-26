/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { base64url } from "rfc4648";

/**
 * same as JSON but handles a couple of extra types in the following way
 *
 * ## stringify
 * - Date -> ["Date","str"]
 * - bigint -> ["BigInt","str"]
 * - TypedArray -> ["Base64","str"]
 *
 * ## parse
 * - ["Date","str"] -> Date
 * - ["BigInt","str"] -> bigint
 * - ["Base64","str"] -> Uint8Array
 */
export const JSONE = {
  stringify,
  parse,
};

function stringify(value: any, space?: string | number) {
  return JSON.stringify(replace(value), (_key, val) => replace(val), space);
}

function parse(text: string) {
  return JSON.parse(text, (_key, val) => revive(val));
}

function revive(value: any) {
  const maybeSpecialTuple = Array.isArray(value) && value.length === 2 && typeof value[1] === "string";
  if (maybeSpecialTuple && value[0] === "Date") {
    return new Date(value[1]);
  } else if (maybeSpecialTuple && value[0] === "BigInt") {
    return BigInt(value[1]);
  } else if (maybeSpecialTuple && value[0] === "Base64") {
    return base64stringToBuffer(value[1]);
  } else {
    return value;
  }
}

export function replace(value: any): any {
  if (Array.isArray(value)) {
    return value.map(replace);
  } else if (value instanceof Date) {
    return ["Date", value.toISOString()];
  } else if (typeof value === "bigint") {
    return ["BigInt", value.toString()];
  } else if (value instanceof Uint8Array) {
    return ["Base64", uint8ArrayToBase64String(value)];
  } else if (ArrayBuffer.isView(value)) {
    //allow other TypedArray's aswell
    return ["Base64", uint8ArrayToBase64String(new Uint8Array(value.buffer))];
  } else if (value === Object(value)) {
    //see note about JSON.stringify with replacer
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replace(v)]));
  } else {
    return value;
  }
}

function uint8ArrayToBase64String(x: Uint8Array) {
  return base64url.stringify(x, { pad: false });
}

function base64stringToBuffer(str: string): Uint8Array {
  return base64url.parse(str, { loose: true });
}
/*
note about JSON.stringify with replacer:

JSON.stringify uses the value.toJSON() if it exists before even trying
the replacer function, so replace before getting to the value itself

another option is monkey patching the toJSON, something like
Date.prototype.toJSON = function () {return ["Date", this.toISOString()];};
Buffer.prototype.toJSON = function () {return ["Base64", this.toString("base64url")];};
but thats bad practise
*/
