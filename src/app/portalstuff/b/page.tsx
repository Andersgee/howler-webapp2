//import { SomExpensiveComp } from "../SomExpensiveComp";
import { PreloadedSomExpensiveComp as SomExpensiveComp } from "../SomExpensiveComp";

export default function Page() {
  return (
    <div>
      <div>page b</div>
      <SomExpensiveComp />
    </div>
  );
}
