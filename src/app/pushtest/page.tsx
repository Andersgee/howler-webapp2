import { JotaiTestComp } from "./JotaiTestComp";
import { WebPushTestComp } from "./WebPushTestComp";

export default function Page() {
  return (
    <div>
      <div>
        <WebPushTestComp />
        <JotaiTestComp />
      </div>
    </div>
  );
}
