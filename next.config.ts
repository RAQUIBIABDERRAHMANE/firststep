import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql', 'better-sqlite3'],
};

export default nextConfig;
