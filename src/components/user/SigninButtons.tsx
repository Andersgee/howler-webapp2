"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconGoogle, IconDiscord, IconGithub } from "#src/icons/special";
import { useUserAgent } from "#src/hooks/useUserAgent";

const linkStyles =
  "bg-color-unthemed-neutral-0 hover:bg-color-unthemed-neutral-100 focus:bg-color-unthemed-neutral-200 text-color-unthemed-neutral-1000 mb-4 flex w-64 items-center justify-around p-3 font-medium shadow-md transition duration-100 ease-out hover:ease-in";

export function SigninButtons() {
  const pathname = usePathname();
  const { isConsideredSafeForOauth } = useUserAgent();

  if (!isConsideredSafeForOauth) {
    return (
      <div className="bg-color-unthemed-neutral-0 p-4">
        <p className="mb-2 text-sm font-semibold text-color-unthemed-neutral-800">
          Cant sign in with Facebook in-app browser
        </p>
        <p className="text-sm text-color-unthemed-neutral-800">
          Please use a normal browser like Chrome, Safari, Firefox etc.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-color-unthemed-neutral-0 p-4 shadow-md">
      <div>
        <a href={`/api/auth/signin/google?route=${pathname}`} className={linkStyles}>
          <IconGoogle />
          <span>Sign in with Google</span>
        </a>
      </div>

      <div>
        <a href={`/api/auth/signin/discord?route=${pathname}`} className={linkStyles}>
          <IconDiscord />
          <span>Sign in with Discord</span>
        </a>
      </div>
      <div>
        <a href={`/api/auth/signin/github?route=${pathname}`} className={linkStyles}>
          <IconGithub />
          <span>Sign in with Github</span>
        </a>
      </div>

      <p className="mt-3 w-64 text-center font-serif text-sm text-color-unthemed-neutral-600">
        By signing in, you agree to our <br />
        <Link
          className="text-color-unthemed-neutral-600 underline decoration-solid hover:text-color-unthemed-neutral-500"
          href="/terms"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="text-color-unthemed-neutral-600 underline decoration-solid hover:text-color-unthemed-neutral-500"
          href="/privacy"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
