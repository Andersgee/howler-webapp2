export function groupBy<T extends object>(list: T[], key: keyof T): Record<string, T[]> {
  const r: Record<string, T[]> = {};
  for (const item of list) {
    const k = item[key] as string;
    if (Array.isArray(r[k])) {
      r[k]!.push(item);
    } else {
      r[k] = [item];
    }
  }

  return r;
}
