import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Минимальная сборка для Docker-образа: .next/standalone/server.js
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Фото сотрудников загружаются через Server Action (до 5 МБ, см. lib/uploads.ts).
    serverActions: { bodySizeLimit: "6mb" },
  },
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
