import { UserImage32x32, UserImage96x96 } from "#src/components/user/UserImage";
import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
//import { redirect } from "next/navigation";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { seo } from "#src/utils/seo";
import { NoUser } from "./NoUser";
import { hashidFromId } from "#src/utils/hashid";
import { Shell } from "#src/components/Shell";

export const metadata = seo({
  title: "Profile | Howler",
  description: "Manage your profile.",
  url: "/profile",
  image: "/howler.png",
});

export default async function Page() {
  const { api, user } = await apiRsc();

  if (!user) {
    return <NoUser />;
  }

  const userinfo = await api.user.info({ userId: user.id });

  return (
    <Shell>
      <section className="flex flex-col items-center">
        <Link href={`/profile/${hashidFromId(userinfo.id)}`}>
          <UserImage96x96 alt={userinfo.name} image={userinfo.image ?? ""} />
        </Link>
        <h1 className="mt-2">{`Welcome, ${userinfo.name}`}</h1>
        <p>Manage your info</p>
      </section>

      <hr className="py-2" />
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
      <div className="py-2">.</div>
    </Shell>
  );
}
