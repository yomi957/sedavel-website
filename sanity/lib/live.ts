import "server-only";
import { defineLive } from "next-sanity/live";
import { previewClient } from "./preview-client";

// No fallback fake client/project. Missing credentials keep preview disabled.
export const homeLive = previewClient ? defineLive({
  client: previewClient,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: false,
  strict: true,
}) : null;
