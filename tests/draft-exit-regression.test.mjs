import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';
function load(file,imports){const m={exports:{}};const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',js)(name=>{if(!(name in imports))throw Error('Unexpected import '+name);return imports[name]},m,m.exports);return m.exports;}
function config(mode){const old=process.env.NODE_ENV;try{process.env.NODE_ENV=mode;return load('next.config.ts',{'./lib/site-url':{siteConfiguration:()=>({indexable:false})},'./sanity/env':{dataset:'production',projectId:'g117cipn',isSanityConfigured:true}}).default}finally{if(old===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=old}}
test('development exit returns to a valid Cache Components shell without forcing blocking metadata',()=>{const c=config('development');assert.equal(c.htmlLimitedBots,undefined);assert.equal(c.cacheComponents,true);assert.equal(c.partialPrefetching,true);assert.equal(c.experimental.agentFeedback,true)});
test('production retains head metadata and native blog 404 strategy without disabling caching',()=>{const c=config('production');assert.ok(c.htmlLimitedBots.test('Mozilla/5.0'));assert.ok(c.htmlLimitedBots.test('Googlebot'));assert.equal(c.cacheComponents,true);assert.equal(c.partialPrefetching,true);const route=fs.readFileSync('app/(website)/blog/[slug]/page.tsx','utf8');assert.match(route,/const article = await getArticle/);assert.match(route,/notFound\(\)/)});
test('Exit expires the preview session with no cache and mode-appropriate cookie attributes', async () => {
  const old = process.env.NODE_ENV;
  try {
    for (const mode of ['development', 'production']) {
      process.env.NODE_ENV = mode;
      let disabled = 0;
      const set = [];
      const route = load('app/api/draft-mode/disable/route.ts', {
        'next/headers': {
          draftMode: async () => ({ disable: () => disabled++ }),
          cookies: async () => ({ has: () => mode === 'production', set: (...args) => set.push(args) }),
        },
        'next/server': {
          NextResponse: { redirect: url => new Response(null, { status: 307, headers: { location: String(url) } }) },
        },
      });
      const response = await route.GET(new Request('http://localhost:3000/api/draft-mode/disable'));
      assert.equal(disabled, 1);
      assert.equal(response.status, 307);
      assert.equal(response.headers.get('location'), 'http://localhost:3000/');
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      assert.deepEqual(set.map(x => x[0]), ['__prerender_bypass', 'sanity-preview-perspective', 'sanity-preview-variant', 'sanity-preview-partitioned']);
      for (const [, value, options] of set) {
        assert.equal(value, '');
        assert.equal(options.maxAge, 0);
        assert.equal(options.httpOnly, true);
        assert.equal(options.path, '/');
        assert.equal(options.secure, mode === 'production');
        assert.equal(options.partitioned, mode === 'production');
      }
    }
  } finally {
    if (old === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = old;
  }
});
