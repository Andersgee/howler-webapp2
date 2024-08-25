import "./src/utils/validate-process-env.mjs";
import { NEXTCONFIG_imageSizes, NEXTCONFIG_deviceSizes } from "./src/utils/image-sizes-constants.mjs";
//import withBundleAnalyzer from "@next/bundle-analyzer";
import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    imageSizes: NEXTCONFIG_imageSizes,
    deviceSizes: NEXTCONFIG_deviceSizes,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/howler-event-images/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  //experimental: {
  //  logging: {
  //    level: "verbose",
  //  },
  //},
};

//export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
export default withPlausibleProxy()(nextConfig);
