//https://stackoverflow.com/a/8943487
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

export function separateTextUrls(str: string): { type: "text" | "url"; str: string }[] {
  let input = str;
  const urls = input.match(urlRegex);
  if (!urls) {
    return [{ type: "text", str: input }];
  }

  const r: { type: "text" | "url"; str: string }[] = [];

  for (const url of urls) {
    const [before, after] = input.split(url);
    if (before) {
      r.push({ type: "text", str: before });
    }
    r.push({ type: "url", str: url });
    input = after ?? "";
  }
  if (input) {
    r.push({ type: "text", str: input });
  }

  return r;
}
