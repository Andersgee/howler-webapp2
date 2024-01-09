/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** JSON.stringify/parse but handles Date, bigint and Buffer according to my needs */
export const transformer = {
  serialize: stringify,
  deserialize: parse,
  /** just deserialize but on `await res.text()` */
  deserializeResponse: async (res: Response) => parse(await res.text()),
};

export function stringify(input: any) {
  return JSON.stringify(input, replacer);
}

export function parse(response: string) {
  return JSON.parse(response, reviver);
}

function replaceItem(item: any) {
  const type = Object.prototype.toString.call(item).slice(8, -1);
  if (type === "Date") {
    return ["Date", (item as Date).toISOString()];
  } else if (type === "BigInt") {
    return ["BigInt", (item as bigint).toString()];
  } else if (type == "Uint8Array") {
    return ["Base64", bufferToBase64string(item)];
  } else {
    return item;
  }
}

function replacer(key: string, value: any) {
  if (Array.isArray(value)) {
    return value.map(replaceItem);
  } else {
    return replaceItem(value);
  }
}

function reviver(key: string, value: any) {
  const isTuple =
    Array.isArray(value) && value.length === 2 && typeof value[0] === "string" && typeof value[1] === "string";
  if (isTuple && value[0] === "Date") {
    const d = new Date(value[1]);
    if (isNaN(d.getTime())) {
      return value;
    } else {
      return d;
    }
  } else if (isTuple && value[0] === "BigInt") {
    try {
      return BigInt(value[1]);
    } catch {
      return value;
    }
  } else if (isTuple && value[0] === "Base64") {
    return base64stringToBuffer(value[1]);
    //return value[1];
  } else if (isTuple && value[0] === "Json") {
    return JSON.parse(value[1]);
  } else {
    return value;
  }
}

function bufferToBase64string(buffer: Buffer): string {
  return buffer.toString("base64url");
}
function base64stringToBuffer(str: string): Buffer {
  return Buffer.from(str, "base64url");
}

export function stringifypretty(input: any) {
  return JSON.stringify(input, replacer, 2);
}
