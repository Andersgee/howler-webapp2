import { UserImage32x32 } from "#src/components/user/UserImage";
import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { seo } from "#src/utils/seo";

export const metadata = seo({
  title: "Profile | Settings | Howler",
  description: "Manage your settings.",
  url: "/settings/profile",
});

export default async function Page() {
  const { api, user } = await apiRsc();
  if (!user) return null;
  const userinfo = await api.user.info({ userId: user.id });

  return (
    <>
      <section>
        <h2>Personal info</h2>
        <div className="py-2">
          <div>Name</div>
          <div>{userinfo.name}</div>
        </div>
        <div className="py-2">
          <div>Email</div>
          <div>{userinfo.email}</div>
        </div>

        <div className="py-2">
          <div>Profile picture</div>
          <UserImage32x32 alt={userinfo.name} image={userinfo.image ?? ""} />
        </div>

        <div className="py-2">
          <div>Account created</div>
          <div>{userinfo.createdAt.toISOString().slice(0, 10)}</div>
        </div>

        <div className="py-2">
          <div>Signed in via</div>
          <div>{`${[
            userinfo.discordUserId && "discord",
            userinfo.googleUserSub && "google",
            userinfo.githubUserId && "github",
            userinfo.facebookdUserId && "facebook",
          ]
            .filter(Boolean)
            .join(", ")}`}</div>
        </div>
      </section>
      <hr className="py-2" />
      <section>
        <h2>Data & privacy</h2>
        <p>
          We dont gather any information except that which is necessary to use the site. You can delete any personal
          information by deleting you account. See <Link href="/privacy">privacy</Link> and{" "}
          <Link href="/terms">terms</Link> for details.
        </p>
      </section>
      <hr className="py-2" />
      <section>
        <h2>Danger zone</h2>
        <DeleteAccountButton />
      </section>
    </>
  );
}
