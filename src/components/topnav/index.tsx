import { apiRsc } from "#src/trpc/api-rsc";
import { Suspense } from "react";
import { ProfileButton } from "../user/ProfileButton";
import { NotificationsButton } from "./NotificationsButton";
import { TopnavLink } from "./TopnavLink";

export function Topnav() {
  return (
    <div className="flex justify-between p-2">
      <div>
        <div className="flex">
          <TopnavLink label="Explore" href="/" />
          <TopnavLink label="Create" href="/event" />
          {/*<TopnavLink label="ui" href="/ui-showcase" />*/}
        </div>
      </div>
      <div className="flex gap-2">
        <Suspense>
          <Buttons />
        </Suspense>
      </div>
    </div>
  );
}

async function Buttons() {
  const { user } = await apiRsc();
  return (
    <>
      {user && <NotificationsButton user={user} />}
      <ProfileButton user={user} />
    </>
  );
}
