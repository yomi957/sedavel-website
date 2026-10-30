import "server-only";
import { publishedClient } from "./client";

// This secret is never passed as browserToken, a React prop, or a public variable.
const token = process.env.SANITY_API_READ_TOKEN;
export const previewClient = publishedClient && token ? publishedClient.withConfig({ token, useCdn: false, perspective: "drafts", stega: false }) : null;
export const previewConfigured = !!previewClient;
