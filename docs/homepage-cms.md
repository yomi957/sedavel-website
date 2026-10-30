# Published CMS content in the homepage Hero

## Scope and fields

The homepage Hero and its SEO metadata read Sanity. Core Features and Product Showcase now also read published Feature documents as described in [Features CMS](features-cms.md). The remaining sections, including the Pricing preview, continue to use `lib/home-content.ts`. Other public pages, authentication, installer behavior and the shared language mechanism are unchanged.

The existing singleton `homePage` document is reused; its stable ID is `homePage`, matching the Studio structure. The query reads:

- `heroTitleEn` / `heroTitleZh`
- `heroDescriptionEn` / `heroDescriptionZh`
- `heroImage.asset` plus `heroImage.altEn` / `heroImage.altZh`
- `seo.titleEn` / `seo.titleZh` and `seo.descriptionEn` / `seo.descriptionZh`

The only schema addition is the `seo` field using the existing shared `seoMetadata` object type. No previous field is removed. CMS CTA and feature fields remain stored but are not connected to the frontend in this phase.

## Editor workflow

1. Open `http://localhost:3000/studio` and sign in to the correct Sanity project.
2. Select **Home Page / 首页** in the sidebar. Use this singleton entry rather than importing another document ID.
3. Fill both Hero titles and descriptions. Replace/upload the Hero image and fill its English and Chinese alternative text. The frontend displays the actual uploaded image, preserving its aspect ratio.
4. Expand **SEO Title & Description** and edit the English and Chinese metadata if needed. Empty SEO fields retain the existing site defaults.
5. The original schema also requires bilingual Primary/Secondary CTA labels and at least one Feature reference. Complete those existing required fields to publish the first Home Page; a referenced Feature may need to be published first. Set a Feature's availability honestly (planned/coming soon if it is not released). These CMS fields do not change current frontend buttons or feature sections yet.
6. Click **Publish**. Draft-only edits are never shown on the public site.
7. Refresh the homepage and switch EN/中文. Each language reads its own fields. Updating an image creates a new asset URL so it is not confused with the old image cache.

## Freshness

The implementation uses the official `next-sanity` client with `perspective: 'published'`, `useCdn: false` and per-fetch `cache: 'no-store'`. `connection()` makes the read happen at request time in this Cache Components project. The page places it behind Suspense; default content forms a safe initial shell while the fresh content loads.

React `cache()` shares the query between `generateMetadata` and the page **within one request only**, not across visitors or page reloads. There is no timed revalidation delay, CMS webhook or live preview. Once the Sanity publish operation is complete, a normal browser reload requests the current published document. It does not require restarting Next.js or rebuilding. Client back/forward navigation can reuse browser/router state; reload to explicitly request fresh data.

Bypassing Sanity's CDN means a Content Lake request per page load (shared with metadata). This is a deliberate first-stage freshness tradeoff; consider a short cache plus a secret-validated publish webhook when traffic warrants it.

## Fallback and security

- Missing Home Page, missing/blank fields, missing translations or read failures keep the corresponding existing defaults. A missing Chinese field never uses the English CMS field in its place.
- Missing or invalid image assets keep the existing marked placeholder. Image load failures also restore it.
- Only HTTPS images on the configured project's `cdn.sanity.io/images/{projectId}/{dataset}/` path are accepted. The Hero uses the official `next-sanity/image` component, which requests responsive, optimized images directly from Sanity's CDN. This avoids proxy DNS conflicts with Next.js's server-side image optimizer without weakening its private-IP protection or changing other images.
- Each read attempt has an 8-second timeout, with at most one retry for transient read failures. A CMS outage does not replace the homepage with an error page. Server logs contain a generic failure message without query objects, tokens or response data.
- Public datasets require no token. If the dataset is private, configure a **Viewer/read-only** token in `SANITY_API_READ_TOKEN` through `.env.local` or server hosting secrets. Never put it in `NEXT_PUBLIC_` variables, CMS content or chat. `sanity/lib/client.ts` is marked `server-only` and no token is passed to React props.
- The server-rendered SEO uses English, matching the website's current default language. Switching languages updates the browser title and description for the homepage. Distinct indexable EN/ZH URLs are outside this phase.

## Checks

```bash
npm run lint
npx tsc --noEmit
node --test tests/home-cms.test.mjs
npm run build
```

The unit tests cover empty/malformed content, per-field language fallback, image host checks, published/no-store request options, request refresh and error redaction. They use local fixtures and never write to the real Sanity dataset. Real publish verification requires a signed-in project editor to publish the Home Page.
