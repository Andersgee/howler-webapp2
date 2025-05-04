export function groupBy<T, K extends string | number | symbol>(
  iterable: Iterable<T>,
  callbackfn: (item: T, i: number) => K
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const obj: Record<K, T[]> = Object.create(null);

  let i = 0;
  for (const value of iterable) {
    const key = callbackfn(value, i++);
    key in obj ? obj[key].push(value) : (obj[key] = [value]);
  }
  return obj;
}
