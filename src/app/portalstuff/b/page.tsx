//import { SomExpensiveComp } from "../SomExpensiveComp";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { PreloadedSomExpensiveComp as SomExpensiveComp } from "../SomExpensiveComp";

export default function Page() {
  return (
    <div>
      <div>page b</div>
      <SomExpensiveComp />
      <div className="h-28 w-full">
        <GoogleMaps />
      </div>
    </div>
  );
}
