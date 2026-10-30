"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { siteSettingsInitialValue } from "@/sanity/schemaTypes/site-settings";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";
import { presentationPlugin } from "@/sanity/presentation/config";

const singletons = new Set(["homePage", "siteSettings", "websitePage"]);

// An unconfigured checkout renders setup instructions instead of contacting a fake project.
export default isSanityConfigured ? defineConfig({
  name: "sedavel", title: "Sedavel Website CMS", basePath: process.env.SANITY_STUDIO_BASEPATH || "/studio", projectId, dataset,
  plugins: [structureTool({ structure }), ...(presentationPlugin ? [presentationPlugin] : [])],
  schema: { types: schemaTypes, templates: templates => [...templates.filter(t => !singletons.has(t.schemaType)), { id: "features-page", title: "Features Page / 功能页内容", schemaType: "websitePage", value: { pageKey: "features" } }, { id: "pricing-page", title: "Pricing Page / 价格页内容", schemaType: "websitePage", value: { pageKey: "pricing" } }, { id: "download-page", title: "Download Page / 下载页内容", schemaType: "websitePage", value: { pageKey: "download" } }, { id: "referral-page", title: "推广返现 / Referral Rewards", schemaType: "websitePage", value: { pageKey: "referral", referral: { programStatus: "comingSoon", cashbackPercentage: 10, rulesConfirmed: false } } }, { id: "site-settings", title: "Site Settings / 网站设置", schemaType: "siteSettings", value: siteSettingsInitialValue }] },
  document: { newDocumentOptions: options => options.filter(option => !["features-page", "pricing-page", "download-page", "referral-page", "site-settings"].includes(option.templateId)), actions: (actions, context) => singletons.has(context.schemaType) ? actions.filter(action => action.action !== "duplicate" && action.action !== "delete") : actions },
  // Keep Sanity's official login providers and server-enforced project member roles.
}) : null;
