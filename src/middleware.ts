import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_COOKIE_NAME } from "./utils/auth/schema";
import { headers } from "next/headers";

/*
After a user sign in, its redirected from /api/auth/callback/SOME_PROVIDER
that request has a "Set-Cookie" header
I need that value to be in "Cookie" header immediately rather than "after recieving"
so that server components etc can use it

TLDR: this is annyoing, essentially I can not trust server components to have the latest cookie
immediately after a user signs
the cookie will be there in any api requests and will be set in useStore etc
but the server components, cookies() will not have the user cookie
and Im using that in {api,user} = apiRsc() so cant rely on that "state"
better rely on user = useStore.use.user()

now that im writing this, perhaps its because im doing reactcache() on apiRsc() ? 
actually no, literally writing cookies() in a server component will not get the value
for a very long time. not even browser refresh works somehow only enter on url works

OH MY LORD. it had to do with SameSite=Lax, it does not work with SameSite=Strict
which is why I had it as lax in the first place. dont just edit old working code without thinking.

resources:
https://nextjs.org/docs/app/building-your-application/routing/middleware
https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
*/

//export const config = {
//  matcher: "/test",
//};

export default function middleware(request: NextRequest) {
  const h = headers();
  const a = h.get("set-cookie");
  const b = h.getSetCookie();
  if (a) {
    console.log(a);
  }
  if (b) {
    console.log(b);
  }

  //const uc = request.cookies.get(USER_COOKIE_NAME);
  //console.log("middleware, uc:", uc);
  //const request_set_cookies = request.headers.getSetCookie();
  //console.log("request_set_cookies:", request_set_cookies);
  //const requestHeaders = new Headers(request.headers);
  //console.log(requestHeaders);
  //console.log("\n\n");
  const response = NextResponse.next();
  //const sc = requestHeaders.getSetCookie();
  //const response_set_cookies = response.headers.getSetCookie();
  //console.log("response_set_cookies:", response_set_cookies);

  //if (!uc) {
  //  const requestHeaders = new Headers(request.headers);
  //  const sc = requestHeaders.getSetCookie();
  //  console.log("middleware, sc:", sc);
  //  //should be something like ["name1=value1", "name2=value2"]
  //  const v = sc.at(0)?.split("=");
  //  if (v !== undefined && v[0] === USER_COOKIE_NAME && typeof v[1] === "string") {
  //    console.log("todo: set v:", v);
  //    //console.log("setting user cookie in middleware");
  //    //response.cookies.set(v[0], v[1]);
  //  } else {
  //    console.log("ignoring, v:", v);
  //  }
  //}
  //console.log("middleware, hmm:", hmm);

  //console.log("middleware, uc:", uc);

  //requestHeaders.set("Cookie", "hello");

  // You can also set request headers in NextResponse.rewrite
  //const response = NextResponse.next({
  //  request: {
  //    // New request headers
  //    headers: requestHeaders,
  //  },
  //});

  //response.cookies.set("wopsiedoo", "yelp");

  // Set a new response header `x-hello-from-middleware2`
  //response.headers.set("x-hello-from-middleware2", "hello");
  return response;
}
