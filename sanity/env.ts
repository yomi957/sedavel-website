// Public identifiers only. Tokens must never be exposed through this module.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-10-01";

export const isSanityConfigured = /^[a-z0-9]+$/.test(projectId) && /^[a-z0-9_][a-z0-9_-]*$/.test(dataset);
