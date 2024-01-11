import "./globals.css";
import { fontSans } from "#src/utils/font";
import { apiRsc } from "#src/trpc/api-rsc";
import { Providers } from "#src/context/Providers";
import { seo } from "#src/utils/seo";
import { Toaster } from "#src/ui/toaster";
import { Topnav } from "#src/components/topnav";

export const metadata = seo({
  title: "Boilerplate app",
  description: "Boilerplate app",
  url: "/",
  image: "/andyfx.png",
});

export const runtime = "edge";
//export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  void apiRsc(); //preload, see https://react.dev/reference/react/cache#preload-data
  return (
    <html lang="en" className={fontSans.variable}>
      <body>
        <Providers>
          <Topnav />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
