# Sedavel Website CMS

## Scope

The embedded Studio is at `/studio`. It uses the existing Sanity project and the `production` dataset. No project, dataset, user or content is created automatically. This stage does not read CMS content into the public website: all current static data remains in place.

The website routes live in `app/(website)` and retain their existing URLs and shared language provider. Studio has its own root layout in `app/(studio)` and does not import the website's Tailwind stylesheet, Google fonts, header, footer or language context. Moving between these two root layouts performs a full page navigation by design. Studio is not linked from public navigation and exports `noindex` metadata.

## Local configuration

Use Node.js 22.12 or newer (Node 24 recommended for this checkout).

```bash
npm ci
cp .env.example .env.local
```

Fill in the existing project's ID and dataset in `.env.local`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your-existing-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-10-01
```

Project IDs and dataset names are public identifiers. They are bundled into browser code. **Never place a password, API token, read token or write token in a `NEXT_PUBLIC_` variable or CMS document.** `.env.local` is ignored by Git. `.env.example` deliberately contains no project-specific values or secrets. The Studio does not need a shared API token: editors sign in using Sanity's official providers.

Restart the dev server after changing environment variables:

```bash
npm run dev
```

Visit `http://localhost:3000/studio`.

An unconfigured clone shows setup instructions instead of using a fabricated project ID. Public pages still render without CMS credentials.

## Required project-owner steps

1. Confirm that **Sedavel Website CMS** is the correct project and the **production** dataset exists. Do not initialize another project.
2. In [Sanity Manage](https://www.sanity.io/manage), select the project, then API settings → CORS origins. Add `http://localhost:3000` with **Allow credentials**. Add only the exact trusted development/deployment origins you actually use; do not enable wildcard credentialed CORS.
3. Open `/studio` and sign in using Sanity's official login screen. The user must be a member of this project with an appropriate editor role. The Sedavel `/register` page is unrelated to CMS access.
4. Invite additional editors from Sanity project Members. Grant the minimum required role. Do not expose a shared write token to give anonymous visitors editing rights.
5. Confirm login, document creation, image upload, draft saving and publishing while signed in. No test content is inserted automatically.

Do not run `sanity init`, `sanity deploy` or dataset creation commands as part of this setup. If a CLI command requires login, complete the official browser authentication yourself; never send credentials in chat.

## Content models

| Model | Content |
| --- | --- |
| `homePage` | EN/ZH hero titles and descriptions, image, bilingual CTA labels, ordered feature references |
| `feature` | EN/ZH names/descriptions, image, display order and product availability status |
| `blogPost` | EN/ZH titles, summaries and rich text bodies; slug, image, category, publication date and bilingual SEO |
| `helpArticle` | EN/ZH titles and rich text; slug, category, display order and bilingual SEO |
| `siteSettings` | Website name, contact email, social links, bilingual SEO defaults and default language |

Shared objects: `localizedString`, `contentImage` (hotspot and EN/ZH alternative text), `portableText` (text, links and uploaded images), `seoMetadata`.

Home Page and Site Settings are presented as singletons with stable IDs. Their duplicate/delete actions and generic creation templates are hidden to reduce accidental duplicates; these UI choices are not server-side access rules. All document types retain Sanity's standard draft/publish workflow. A Feature's `publicationStatus` describes product availability, independently of whether its document is published.

Both languages are separately editable in the same document. Required fields block publishing until valid; drafts can remain incomplete. Blog/help slug validation checks uniqueness across document types while excluding the current document's draft, release and published versions. This is a Studio validation check, **not a database uniqueness constraint**: direct API imports and concurrent changes need their own validation. Future website queries must use `perspective: 'published'` and explicitly filter product availability before presenting a capability as released.

Pricing, installer links, payment configuration, passwords and API keys are intentionally not modeled.

## Dependency compatibility

This integration uses Next.js 16.4.3, next-sanity 13.4, Sanity Studio 6.20 and styled-components 6.6. React and React DOM are patched from 19.3.0 to 19.3.1 to satisfy the Portable Text editor peer dependency. `@next/env` explicitly loads Next.js-style local environment files for the Sanity CLI.

The `package.json` overrides are scoped to vulnerable Sanity CLI transitive dependencies (`@vercel/frameworks` parsers, module-federation HTTP client, and the UUID dependency used by `typeid-js`). They retain current Studio versions rather than applying the audit tool's suggested major downgrade. Recheck them when upgrading Sanity; do not remove them without rerunning the audit, schema extraction and build. The TypeID generation/parse/UUID conversion path was checked after updating its UUID implementation.

## Local checks

```bash
npm run lint
npx tsc --noEmit
npm run build
npx sanity schema extract --path /private/tmp/sedavel-sanity-schema.json
```

Schema extraction is local and does not deploy schemas or publish content. Authentication, dataset membership and CORS can only be fully verified against the real project in the browser. A successful Next.js build alone does not prove editor authorization.

## Frontend integration later

1. Add a server-side Sanity client with the chosen API version and published perspective; keep private-dataset read credentials on the server if needed.
2. Start with Blog or Help, one route at a time. Query explicit fields and document types. Keep the existing static content as a fallback while CMS documents are incomplete.
3. Add a Portable Text renderer and Sanity image URL handling with a narrow image-host allowlist when frontend images are actually connected.
4. Add secret-protected webhook revalidation and authenticated draft preview in a separate phase.
5. Test empty data, missing translations, draft visibility, slug changes and unavailable product features before making the CMS authoritative.
