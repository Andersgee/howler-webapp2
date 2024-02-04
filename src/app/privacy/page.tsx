import Link from "next/link";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="px-2">
        <h1 className="mb-6 text-2xl">privacy policy</h1>
        <p>Effective Date: 2024-02-04</p>
        <p>
          This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how
          you can delete your information.
        </p>
        <h2>Summary</h2>
        <p>
          We dont gather any information except that which is necessary to use the site. You can delete any personal
          information by deleting you account.
        </p>
        <h2>Cookies</h2>
        <p>
          Cookies are small pieces of text sent to your browser by a website that helps remember information about your
          visit
        </p>
        <p>
          Howler uses cookies to remember you, so that you dont have to manually sign in every time you visit a site.
        </p>
        <h2>Things you create or provide to us</h2>
        <p>
          When you create an account, by signin in with google for example, you provide us with basic personal
          information: email, name and profile picture. This info is not shared with any third parties but is stored and
          may be publicly visible by anyone using the app, on events you create for example.
        </p>
        <p>We also store the content you create, upload, or receive from others when using our services.</p>
        <h2>Deleting your information</h2>
        <p>
          You can delete your account at <Link href="/profile">your profile</Link>
        </p>
      </div>
    </div>
  );
}
