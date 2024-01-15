import { apiRsc } from "#src/trpc/api-rsc";
import { ProfileButton } from "../user/ProfileButton";
import { TopnavLink } from "./TopnavLink";

export async function Topnav() {
  const { user } = await apiRsc();
  //const user = useStore.use.user();
  return (
    <div className="m-2 flex justify-between">
      <div>
        <div className="flex">
          <TopnavLink label="Explore" href="/" />
          <TopnavLink label="Create" href="/event" />
          {/*<TopnavLink label="ui" href="/ui-showcase" />*/}
        </div>
      </div>
      <div>
        <ProfileButton user={user} />
      </div>
    </div>
  );
}
