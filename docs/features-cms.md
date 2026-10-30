# Published Feature content

## Shared data

The homepage Core Features/Product Showcase and `/features` read the same published `feature` documents from the existing project. `sanity/lib/features.ts` uses the existing server-only client with published perspective, no CDN, `cache: 'no-store'` and request-time rendering. A browser reload fetches the latest published data; no rebuild or webhook is required. Draft edits remain private.

The shared normalizer, selection and bilingual mapping live in `lib/features-cms.ts`. Both routes use `FeatureShowcase`, including the same descriptions, benefits, statuses, actual images and placeholders. Visibility filtering occurs on the server before React props are sent to the browser.

## Schema compatibility

Existing fields `nameEn`, `nameZh`, `descriptionEn`, `descriptionZh`, `image`, `displayOrder` and **`publicationStatus`** are retained. The latter is now labeled **Feature Status**; its stored field name has not changed. It describes product availability, not Sanity's separate Draft/Published document workflow.

New fields:

- `featureKey`: optional stable core identity (`translation`, `messaging`, `customers`, `ai`), unique across feature documents. Helps replace the corresponding static default even if a title is renamed. Additional non-core features may leave it empty. Existing recognized EN/ZH core names are mapped for compatibility.
- `benefitsEn`, `benefitsZh`: optional lists (up to six short points). Prefer two or three per language. Empty existing CMS lists remain empty rather than inheriting potentially inaccurate product claims from static defaults.
- `showOnHomepage`: homepage visibility only.
- `isPublic`: visibility on both routes.

Feature Image already uses `contentImage`, which has `altEn` and `altZh`, upload/replacement and hotspot support. No duplicate image/alt fields are added.

New status option `inDevelopment` joins existing `available` and `comingSoon`. Existing `planned` and `archived` values remain supported, without migrations or data changes. New documents start in development; no feature is automatically declared released. AI Copilot is currently unreleased: the UI treats an old `available` value as Coming Soon, and Studio prevents publishing that value when its AI core key is selected. Change the actual product availability only after release is confirmed.

## Selection and fallback

- Published records are sorted by Display Order, then document ID for ties.
- For old records without visibility flags, missing/null values mean visible, preserving their current appearance. New records also default to visible. Explicit `false` always hides the record at the requested scope.
- Hidden/archived core records suppress their static counterpart so a deliberate hide is not undone by fallback. If all core features are intentionally hidden, no cards are resurrected.
- With no valid published data or a read failure, the original four static features remain visible on both routes.
- With partial CMS data, each recognized core document replaces the matching static feature. Core entries not yet managed in CMS keep their static defaults. Additional visible CMS records are also shown.
- Missing translations use that language's own static counterpart when available, never the opposite CMS language. Missing custom-feature descriptions use a neutral localized placeholder.
- Missing/broken/untrusted images use the existing clearly labeled screenshot placeholder. Uploaded images use Sanity's official responsive image component, like the Hero.

## Editor steps

1. Open `/studio` → Features. Edit the existing four documents; do not create duplicates.
2. Set the corresponding Core Feature key for each document. Keep the existing names, descriptions and data unless you intend to change them.
3. Fill EN/ZH Benefits, and upload real images with both alt texts when available. Do not upload fabricated software screenshots.
4. Set Display Order and the actual Feature Status. **AI Copilot should be Coming Soon**, even if its old field currently says Available. Verify other product availability before selecting Available.
5. Set Publicly Visible and Show on Homepage. Turning off only Show on Homepage keeps a public feature on `/features`.
6. Publish, refresh both pages, and switch languages. Confirm matching content and ascending order.

The Home Page's older `featureSections` reference field is preserved but is not the filter/order source in this phase. Use the Feature visibility flags and Display Order to avoid maintaining two competing lists.

## Checks

```bash
npm run lint
npx tsc --noEmit
node --test tests/home-cms.test.mjs tests/features-cms.test.mjs
npm run build
```

Tests cover empty data, partial fallback, explicit hiding, draft/archived filtering, language mapping, legacy status compatibility, ordering and request freshness. No tests mutate or publish real Sanity documents.
