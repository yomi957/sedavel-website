import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function loadTs(filename, imports = {}) {
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiled = { exports: {} };
  new Function("require", "module", "exports", code)(specifier => {
    if (Object.hasOwn(imports, specifier)) return imports[specifier];
    return require(specifier);
  }, compiled, compiled.exports);
  return compiled.exports;
}
// next-sanity/image targets a bundler; transpile its ESM for this Node-only test.
const { imageLoader } = loadTs(require.resolve("next-sanity/image"));
const { homeContent } = loadTs("lib/home-content.ts");
const helpers = loadTs("lib/home-cms.ts", { "@/lib/home-content": { homeContent } });
const { normalizeHomeContent, resolveHomeHero, resolveHomeSeo, homeDefaultSeo } = helpers;
const project = "g117cipn";
const dataset = "production";
const image = { url: `https://cdn.sanity.io/images/${project}/${dataset}/example-1600x900.png`, width: 1600, height: 900, altEn: "Product workspace", altZh: "产品工作区" };

test("empty, malformed or whitespace-only CMS content retains exact defaults in both languages", () => {
  for (const raw of [null, undefined, [], "invalid", {}, { heroTitleEn: "  ", heroDescriptionZh: 123 }]) {
    const content = normalizeHomeContent(raw, project, dataset);
    for (const locale of ["en", "zh"]) {
      const hero = resolveHomeHero(locale, content);
      assert.deepEqual(hero.titleLines, homeContent[locale].heroTitle);
      assert.equal(hero.description, homeContent[locale].heroBody);
      assert.equal(hero.image, null);
      assert.deepEqual(resolveHomeSeo(locale, content), homeDefaultSeo);
    }
  }
});

test("published bilingual fields and image alt text map to the selected language", () => {
  const content = normalizeHomeContent({ heroTitleEn: "English headline", heroTitleZh: "中文标题", heroDescriptionEn: "English description", heroDescriptionZh: "中文副标题", heroImage: image, seo: { titleEn: "English SEO", titleZh: "中文 SEO", descriptionEn: "English search description", descriptionZh: "中文搜索描述" } }, project, dataset);
  assert.deepEqual(resolveHomeHero("en", content).titleLines, ["English headline"]);
  assert.deepEqual(resolveHomeHero("zh", content).titleLines, ["中文标题"]);
  assert.equal(resolveHomeHero("en", content).description, "English description");
  assert.equal(resolveHomeHero("zh", content).description, "中文副标题");
  assert.equal(resolveHomeHero("en", content).image.alt, "Product workspace");
  assert.equal(resolveHomeHero("zh", content).image.alt, "产品工作区");
  assert.equal(resolveHomeSeo("en", content).title, "English SEO");
  assert.equal(resolveHomeSeo("zh", content).description, "中文搜索描述");
});

test("partial translations fall back field by field, never to the opposite language", () => {
  const content = normalizeHomeContent({ heroTitleEn: "Only English", heroDescriptionZh: "仅中文说明", heroImage: { ...image, altZh: " " }, seo: { titleEn: "Only English SEO" } }, project, dataset);
  assert.deepEqual(resolveHomeHero("zh", content).titleLines, homeContent.zh.heroTitle);
  assert.equal(resolveHomeHero("en", content).description, homeContent.en.heroBody);
  assert.equal(resolveHomeHero("zh", content).description, "仅中文说明");
  assert.equal(resolveHomeHero("zh", content).image.alt, "Sedavel 产品工作区截图");
  assert.equal(resolveHomeSeo("zh", content).title, homeDefaultSeo.title);
});

test("only actual assets in this project's Sanity image path are accepted", () => {
  for (const raw of [
    { ...image, url: "https://example.com/product.png" },
    { ...image, url: "https://cdn.sanity.io/images/another-project/production/example.png" },
    { ...image, url: "https://cdn.sanity.io/images/g117cipn/private/example.png" },
    { ...image, url: "javascript:alert(1)" },
    { ...image, width: 0 }, { ...image, width: 0.4 }, { ...image, height: Number.NaN },
  ]) assert.equal(resolveHomeHero("en", normalizeHomeContent({ heroImage: raw }, project, dataset)).image, null);
  assert.equal(resolveHomeHero("en", normalizeHomeContent({ heroImage: image }, project, dataset)).image.url, image.url);
});

function serverReader(client) {
  return loadTs("sanity/lib/home-page.ts", {
    "server-only": {},
    react: { cache: fn => fn }, // Each invocation represents a separate request scope.
    "next/server": { connection: async () => {} },
    "next-sanity": { defineQuery: query => query },
    "@/lib/home-cms": helpers,
    "@/sanity/env": { projectId: project, dataset },
    "./client": { publishedClient: client },
  });
}

test("request-time reader asks for the published singleton without storing the result across requests", async () => {
  let calls = 0;
  const reader = serverReader({ fetch: async (query, params, options) => {
    assert.match(query, /_id == "homePage"/);
    assert.match(query, /_type == "homePage"/);
    assert.equal(options.perspective, "published");
    assert.equal(options.cache, "no-store");
    assert.deepEqual(params, {});
    return ++calls === 1 ? null : { heroTitleEn: "Newly published headline" };
  } });
  assert.equal(await reader.getPublishedHomePage(), null);
  assert.equal((await reader.getPublishedHomePage()).heroTitleEn, "Newly published headline");
  assert.equal(calls, 2);
});

test("missing configuration and Sanity request failure retain defaults without disclosing errors", async () => {
  assert.equal(await serverReader(null).getPublishedHomePage(), null);
  const original = console.warn;
  const messages = [];
  console.warn = message => messages.push(message);
  try {
    assert.equal(await serverReader({ fetch: async () => { throw new Error("private request details"); } }).getPublishedHomePage(), null);
    assert.equal(messages.length, 1);
    assert.ok(!messages[0].includes("private request details"));
  } finally { console.warn = original; }
});


test("official Sanity image loader uses the CDN directly with responsive optimization", () => {
  const url = new URL(imageLoader({ src: image.url, width: 640, quality: 75 }));
  assert.equal(url.origin, "https://cdn.sanity.io");
  assert.ok(url.pathname.startsWith(`/images/${project}/${dataset}/`));
  assert.equal(url.searchParams.get("w"), "640");
  assert.equal(url.searchParams.get("q"), "75");
  assert.equal(url.searchParams.get("auto"), "format");
  assert.equal(url.searchParams.get("fit"), "max");
});
