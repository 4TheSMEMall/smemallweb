import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Teach Next.js where to find our shared workspace package
  transpilePackages: ["@sme-mall/shared"],

  webpack(config) {
    config.resolve.alias["@sme-mall/shared"] = path.resolve(
      __dirname,
      "../../packages/shared/src/index.ts"
    );
    return config;
  },
};

export default nextConfig;
