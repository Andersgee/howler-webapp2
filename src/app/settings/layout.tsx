import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { NotSignedInPage } from "./NotSignedInPage";
import { Shell } from "#src/components/Shell";
import { hashidFromId } from "#src/utils/hashid";
import { UserImage96x96 } from "#src/components/user/UserImage";
import { buttonVariants } from "#src/ui/button";
import { seo } from "#src/utils/seo";

export const metadata = seo({
  title: "Settings | Howler",
  description: "Manage your settings.",
  url: "/settings",
});

type Props = {
  children: React.ReactNode;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  //params: { slug: string };
};

export default async function Layout({ children }: Props) {
  const { api, user } = await apiRsc();
  if (!user) {
    return <NotSignedInPage />;
  }
  const userinfo = await api.user.info({ userId: user.id });

  return (
    <Shell>
      <section className="mt-8 flex flex-col items-center">
        <p className="pb-4">
          your howler id: <span className="font-bold">{hashidFromId(user.id)}</span>
        </p>

        <Link href={`/profile/${hashidFromId(userinfo.id)}`}>
          <UserImage96x96 alt={userinfo.name} image={userinfo.image ?? ""} />
        </Link>
        <h1 className="mt-2">{`Welcome, ${userinfo.name}`}</h1>

        <p>Manage your settings</p>
      </section>

      <hr className="py-2" />

      <Nav />
      <hr className="py-2" />

      {children}
    </Shell>
  );
}

function Nav() {
  return (
    <div className="flex justify-center gap-2">
      <Link href="/settings/profile" className={buttonVariants({ variant: "outline" })}>
        Profile
      </Link>
      <Link href="/settings/notifications" className={buttonVariants({ variant: "outline" })}>
        Notifications
      </Link>
    </div>
  );
}
