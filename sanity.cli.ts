import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

// Only these three already-public values are exposed to the standalone bundle.
// Never spread process.env or expose SANITY_API_READ_TOKEN / SANITY_AUTH_TOKEN.
const publicValues = {
  "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""),
  "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify(process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"),
  "process.env.NEXT_PUBLIC_SANITY_API_VERSION": JSON.stringify(process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-10-01"),
};

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  deployment: { appId: "m93mdu2m1uinkptudli3ywcg" },
  vite: config => ({
    ...config,
    define: { ...config.define, ...publicValues },
    resolve: {
      ...config.resolve,
      alias: [
        { find: "@", replacement: process.cwd() },
        ...(Array.isArray(config.resolve?.alias) ? config.resolve.alias : Object.entries(config.resolve?.alias || {}).map(([find, replacement]) => ({ find, replacement }))),
      ],
    },
  }),
});
