import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql', 'better-sqlite3'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.github.dev',
        '*.app.github.dev',
        '*.ws-us*.gitpod.io'
      ]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
