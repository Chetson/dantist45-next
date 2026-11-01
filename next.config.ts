import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Минимальная сборка для Docker-образа: .next/standalone/server.js
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
