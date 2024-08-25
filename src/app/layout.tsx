import "./globals.css";
//import { fontSans } from "#src/utils/font";
import { apiRsc } from "#src/trpc/api-rsc";
import { Providers } from "#src/context/Providers";
import { seo } from "#src/utils/seo";
import { Toaster } from "#src/ui/toaster";
import { Topnav } from "#src/components/topnav";
import { Inter } from "next/font/google";

const fontSans = Inter({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = seo({
  title: "Howler",
  description: "Quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/",
  image: "/howler.png",
});

//export const runtime = "edge";
//export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  void apiRsc(); //preload, see https://react.dev/reference/react/cache#preload-data
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="m-0 p-0">
        <Providers>
          <Topnav />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
