import { apiRsc } from "#src/trpc/api-rsc";
import { seo } from "#src/utils/seo";
import { NotificationnSettings } from "./NotificationSettings";

export const metadata = seo({
  title: "Profile | Settings | Howler",
  description: "Manage your settings.",
  url: "/settings/notifications",
});

export default async function Page() {
  const { api, user } = await apiRsc();
  if (!user) return null;

  const mYPushSubscriptions = await api.webpush.myPushSubscriptions();

  return (
    <div>
      <NotificationnSettings mYPushSubscriptions={mYPushSubscriptions} />
    </div>
  );
}
