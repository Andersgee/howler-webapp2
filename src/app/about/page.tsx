import { Shell } from "#src/components/Shell";
import Link from "next/link";

export default function Page() {
  return (
    <Shell>
      <div className="flex justify-center">
        <div className="px-2">
          <h1 className="mb-6 text-2xl">About howler</h1>

          <p>Howler lets people create, organize and find events.</p>

          <p>
            Its hard to find time to see friends and to find people with similar intereststs to hang with. The vision of
            howler is to create the most effortless way to get your friends together or gather people with similar
            interesets.
          </p>

          <p>How? Howl! Gather your pack!</p>

          <h2>Data safety</h2>
          <p>
            Howler is a public platform, meaning content you create or provide, such as events you create or your public
            profile, may be publicly visible.
          </p>
          <p>
            See the{" "}
            <Link href="/privacy" className="underline">
              privacy policy
            </Link>{" "}
            for more details.
          </p>
        </div>
      </div>
    </Shell>
  );
}
