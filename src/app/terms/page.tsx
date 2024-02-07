import { Shell } from "#src/components/Shell";

export default function Page() {
  return (
    <Shell>
      <h1 className="mb-6 text-2xl">terms of service</h1>
      <ul className="max-w-[55ch] list-inside list-disc space-y-2">
        <li>Howler is a web app that lets people create/organize/find events.</li>
        <li>Dont spam/abuse the service or create offensive content.</li>
        <li>
          Misuse of the service in any way deemed inappropriate by the creators/developers may result in removal of your
          account.
        </li>
      </ul>
    </Shell>
  );
}
