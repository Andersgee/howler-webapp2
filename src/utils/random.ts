export function randomUuid() {
  return crypto.randomUUID();
}

export function randomUint() {
  const v = new Uint32Array(1);
  crypto.getRandomValues(v);
  return 1 + v[0]!;
}
