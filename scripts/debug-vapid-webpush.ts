import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { webPush } from "#src/lib/web-push/web-push";

async function main() {
  const endpoint =
    "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABm5v43w55HsuCJQIQ9gxXxfpMqa7tIjyE6_jRGV4QN5PpF-GZhksqCALJZ9X-0whGkFYgyYOzoJMdgfqt1WGLBtFaRyQkGvnwKVixwEfDS4vIt5s2ZMLVydKxA5k7PE_wOsKpiruHl9RrcaRch1sz0pARYTaX8vuLiWMMAjntvqnCjXlQ";

  try {
    const res = await webPush(endpoint, "hello from debug");
    const resText = await res.text();
    console.log(resText);
  } catch (err) {
    console.log(err);
  }

  return 1;
}

void main();
