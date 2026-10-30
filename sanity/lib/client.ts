import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

// This module must never be imported into a Client Component or Studio config.
// A private dataset may need a Viewer token, supplied only through server env.
export const publishedClient = isSanityConfigured ? createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  stega: false,
  timeout: 8000,
  maxRetries: 1,
}) : null;
