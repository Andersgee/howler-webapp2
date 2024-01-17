function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && !Array.isArray(value) && typeof value === "object";
}

export function errorMessageFromUnkown(err: unknown, fallback = "no error message"): string {
  if (typeof err === "string") {
    return err;
  }
  if (isObject(err) && typeof err.message === "string") {
    return err.message;
  }
  return fallback;
}
