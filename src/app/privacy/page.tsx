import { Shell } from "#src/components/Shell";
import Link from "next/link";

export default function Page() {
  return (
    <Shell>
      <h1 className="mb-6 text-2xl">privacy policy</h1>
      <p>Effective Date: 2024-02-06</p>
      <p>
        Howler is a web app that lets people create/organize/find events. In this document &quot;we&quot;, &quot;the
        app&quot; or &quot;us&quot; refers to Howler.
      </p>
      <p>
        This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you
        can delete your information.
      </p>
      <h2>Summary</h2>
      <p>
        We dont gather any extra information about you except that which is necessary to use the site. You can delete
        any personal information by deleting you account.
      </p>
      <h2>Cookies</h2>
      <p>
        Cookies are small pieces of text sent to your browser by a website that helps remember information about your
        visit
      </p>
      <p>
        Howler uses cookies to remember you, so that you dont have to manually sign in every time you visit the site.
      </p>

      <h2>Handling of Google user data</h2>
      <p>When you sign in with Google, you give Howler permission to request some (non-sensitive) personal info</p>
      <ul className="list-inside list-disc space-y-2">
        <li>email: See your primary Google Account email address</li>
        <li>profile: See your personal info, including any personal info you&apos;ve made publicly available </li>
        <li>openid: Associate you with your personal info on Google</li>
      </ul>
      <p>This info is stored and used to create your account on howler and associate you with a google user id.</p>
      <p>
        Howler is a public platform, meaning this (non-sensitive) info may be publicly visible: for example on events
        you create, on your public profile or by search engines.
      </p>
      <h2>Things you create or provide to us</h2>
      <p>
        When signing in with Discord or Github, you provide us with some (non-sensitive) personal information: name,
        email and profile picture. This info is stored and may be publicly available on the internet.
      </p>
      <p>We also store the content you create, upload, or receive from others when using the app.</p>
      <h2>Deleting your information</h2>
      <p>
        You can delete your account at <Link href="/profile">your profile</Link>
      </p>
    </Shell>
  );
}
