import { UserImage32x32, UserImage96x96 } from "#src/components/user/UserImage";
import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "./DeleteAccountButton";

export default async function Page() {
  const { api, user: cookieuser } = await apiRsc();
  if (!cookieuser) redirect("/");

  const user = await api.user.info({ userId: cookieuser.id });

  return (
    <div className="flex justify-center">
      <div className="px-2">
        <section className="flex flex-col items-center">
          <UserImage96x96 alt={user.name} image={user.image ?? ""} />
          <h1>{`Welcome, ${user.name}`}</h1>
          <p>Manage your info</p>
        </section>

        <hr className="py-2" />
        <section>
          <h2>Personal info</h2>
          <div className="py-2">
            <div>Name</div>
            <div>{user.name}</div>
          </div>
          <div className="py-2">
            <div>Email</div>
            <div>{user.email}</div>
          </div>

          <div className="py-2">
            <div>Profile picture</div>
            <UserImage32x32 alt={user.name} image={user.image ?? ""} />
          </div>

          <div className="py-2">
            <div>Account created</div>
            <div>{user.createdAt.toISOString().slice(0, 10)}</div>
          </div>

          <div className="py-2">
            <div>Signed in via</div>
            <div>{`${[user.discordUserId && "discord", user.googleUserSub && "google", user.githubUserId && "github"]
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

        <section>
          <h2>Danger zone</h2>
          <DeleteAccountButton />
        </section>
      </div>
    </div>
  );
}