//import { apiRscPublic } from "#src/trpc/api-rsc";
import { GoogleMapsExplore } from "../components/GoogleMaps/GoogleMapExplore";

export default function Page() {
  //const { api } = apiRscPublic();
  //const events = await api.event.getAll();

  return (
    <div className="h-full-minus-nav w-full">
      <GoogleMapsExplore initialEvents={[]} />
    </div>
  );
}
