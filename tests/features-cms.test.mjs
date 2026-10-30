import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(file, imports = {}) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "module", "exports", code)(name => Object.hasOwn(imports, name) ? imports[name] : require(name), compiled, compiled.exports);
  return compiled.exports;
}
const content = load("lib/home-content.ts");
const home = load("lib/home-cms.ts", { "@/lib/home-content": content });
const helpers = load("lib/features-cms.ts", { "@/lib/cms-content": load("lib/cms-content.ts"), "@/lib/home-content": content, "@/lib/home-cms": home });
const { normalizeFeatures, selectFeatures, localizeFeature } = helpers;
const normalize = raw => normalizeFeatures(raw, "g117cipn", "production");
const row = (key, extra = {}) => ({ _id: key, featureKey: key, nameEn: key, nameZh: `中文${key}`, publicationStatus: "inDevelopment", ...extra });

test("empty CMS retains the same four defaults on both pages, in both languages", () => {
  for (const raw of [null, [], "invalid"]) for (const scope of ["home", "features"]) {
    const records = selectFeatures(normalize(raw), scope);
    assert.equal(records.length, 4);
    for (const locale of ["en", "zh"]) assert.deepEqual(records.map(f => localizeFeature(f, locale).title), content.homeContent[locale].features.map(f => f.title));
  }
});
test("published records replace core defaults once and sort identically by order", () => {
  const raw = [row("translation", { displayOrder: 30 }), row("messaging", { displayOrder: 10 }), row("customers", { displayOrder: 20 }), row("ai", { displayOrder: 40, publicationStatus: "comingSoon" })];
  const homeRecords = selectFeatures(normalize(raw), "home");
  const pageRecords = selectFeatures(normalize(raw), "features");
  assert.deepEqual(homeRecords.map(f => f.id), ["messaging", "customers", "translation", "ai"]);
  assert.deepEqual(homeRecords, pageRecords);
});
test("homepage opt-out never resurrects its static card and remains on Features", () => {
  const rows = normalize([row("translation", { showOnHomepage: false })]);
  assert.ok(!selectFeatures(rows, "home").some(f => f.key === "translation"));
  assert.ok(selectFeatures(rows, "features").some(f => f.key === "translation"));
});
test("private, archived and draft records are never exposed or restored by fallback", () => {
  const rows = normalize([row("translation", { isPublic: false, descriptionEn: "Hidden content" }), row("messaging", { publicationStatus: "archived" }), row("customers", { _id: "drafts.customer" }), row("ai", { _id: "versions.release.ai" })]);
  for (const scope of ["home", "features"]) {
    const output = selectFeatures(rows, scope);
    assert.ok(!output.some(f => ["translation", "messaging"].includes(f.key)));
    assert.ok(!JSON.stringify(output).includes("Hidden content"));
  }
});
test("legacy names, statuses and unset visibility remain compatible without promoting unreleased features", () => {
  const rows = normalize([{ _id: "old-ai", nameEn: "AI Copilot", publicationStatus: "available" }, { _id: "old-customers", nameEn: "Customer Management", publicationStatus: "planned" }, { _id: "old-translation", nameEn: "Real-Time Translation" }]);
  assert.equal(rows[0].key, "ai"); assert.equal(rows[0].status, "comingSoon");
  assert.equal(rows[1].status, "planned"); assert.equal(rows[2].status, "unconfirmed");
  assert.ok(rows.every(r => r.showOnHomepage && r.isPublic));
});
test("translations, benefits, images and statuses use the same source record", () => {
  const f = normalize([row("translation", { descriptionEn: "English body", descriptionZh: "中文说明", benefitsEn: ["Benefit"], benefitsZh: ["优势"], publicationStatus: "inDevelopment", image: { url: "https://cdn.sanity.io/images/g117cipn/production/example.png", width: 1200, height: 800, altEn: "English alt", altZh: "中文图片" } })])[0];
  assert.equal(localizeFeature(f, "en").body, "English body"); assert.equal(localizeFeature(f, "zh").body, "中文说明");
  assert.deepEqual(localizeFeature(f, "en").points, ["Benefit"]); assert.deepEqual(localizeFeature(f, "zh").points, ["优势"]);
  assert.equal(localizeFeature(f, "zh").image.alt, "中文图片"); assert.equal(localizeFeature(f, "zh").status, "开发中");
  const partial = normalize([row("translation", { nameZh: "", descriptionEn: "Custom English only" })])[0];
  assert.equal(localizeFeature(partial, "zh").body, content.homeContent.zh.features[0].body);
});
test("malformed CMS rows and duplicate core keys do not duplicate or remove the remaining defaults", () => {
  const rows = normalize([null, {}, row("translation", { _id: "first", displayOrder: 0 }), row("translation", { _id: "second", displayOrder: 1 })]);
  const selected = selectFeatures(rows, "home"); assert.equal(selected.length, 4); assert.equal(selected.filter(r => r.key === "translation").length, 1);
});
test("server reads only published data without cross-request storage and safely handles outages", async () => {
  let calls = 0;
  const reader = load("sanity/lib/features.ts", { "server-only": {}, react: { cache: fn => fn }, "next/server": { connection: async () => {} }, "next-sanity": { defineQuery: q => q }, "@/lib/features-cms": helpers, "@/sanity/env": { projectId: "g117cipn", dataset: "production" }, "./client": { publishedClient: { fetch: async (query, params, options) => {
    assert.match(query, /_type == "feature"/); assert.equal(options.perspective, "published"); assert.equal(options.cache, "no-store"); calls++; return [row("translation", { nameEn: `Revision ${calls}` })];
  } } } });
  assert.equal((await reader.getPublishedFeatures())[0].nameEn, "Revision 1");
  assert.equal((await reader.getPublishedFeatures())[0].nameEn, "Revision 2");
});


test("legacy CMS records without benefits do not inherit static planned claims", () => {
  const f = normalize([row("customers", { publicationStatus: "available" })])[0];
  assert.deepEqual(localizeFeature(f, "en").points, []);
  assert.equal(localizeFeature(f, "en").status, "Available");
});
