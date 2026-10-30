import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
function load(file,imports={}){const m={exports:{}};const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',js)(n=>{if(!Object.hasOwn(imports,n))throw Error(n);return imports[n]},m,m.exports);return m.exports;}
const policy=load('lib/preview-policy.ts');
test('preview destinations reject external, protocol-relative, encoded, API and Studio redirects',()=>{
 for(const value of ['https://evil.test','//evil.test','/\\evil.test','/%2f%2fevil.test','/api/draft-mode/enable','/studio','/?evil=1','/?previewLocale=fr','/?sanity-preview-perspective=raw'])assert.equal(policy.safePreviewPath(value),undefined,value);
 assert.equal(policy.safePreviewPath('/?previewLocale=zh'), '/?previewLocale=zh');assert.equal(policy.safePreviewPath('/features'),'/features');assert.equal(policy.validatedPreviewOrigin('https://evil.test'),undefined);assert.equal(policy.validatedPreviewOrigin('http://localhost:3000'),'http://localhost:3000');
});
test('enable route delegates only allowed, configured requests to Sanity official secret verification',async()=>{
 let calls=0;const imports={'@/lib/preview-policy':policy,'@/sanity/lib/preview-client':{previewClient:{}},'next-sanity/draft-mode':{defineEnableDraftMode:()=>({GET:async()=>{calls++;return new Response('verified by official helper',{status:202})}})}};
 const {GET}=load('app/api/draft-mode/enable/route.ts',imports);
 for(const [url,headers,status] of [['http://localhost:3000/api/draft-mode/enable',{},401],['http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=x&sanity-preview-pathname=//evil.test',{},400],['http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=x',{origin:'https://evil.test'},403],['https://evil.test/api/draft-mode/enable?sanity-preview-secret=x',{},403]])assert.equal((await GET(new Request(url,{headers}))).status,status);
 assert.equal(calls,0);assert.equal((await GET(new Request('http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=x&sanity-preview-pathname=/?previewLocale=zh',{headers:{referer:'http://localhost:3000/studio/presentation'}}))).status,202);assert.equal(calls,1);
 const missing=load('app/api/draft-mode/enable/route.ts',{...imports,'@/sanity/lib/preview-client':{previewClient:null}});assert.equal((await missing.GET(new Request('http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=x'))).status,503);assert.equal(calls,1);
});
test('Presentation keeps local preview local, disables public sharing and maps only enabled CMS pages',()=>{
 const originals={base:process.env.SANITY_STUDIO_BASEPATH,origin:process.env.SANITY_STUDIO_PREVIEW_ORIGIN};
 const imports={'sanity/presentation':{presentationTool:v=>v,defineDocuments:v=>v,defineLocations:v=>v},'@/lib/preview-policy':policy,'./navigator':{PreviewNavigator:()=>null}};
 try{delete process.env.SANITY_STUDIO_BASEPATH;delete process.env.SANITY_STUDIO_PREVIEW_ORIGIN;const local=load('sanity/presentation/config.ts',imports).presentationPlugin;assert.equal(local.previewUrl.initial,'http://localhost:3000/?previewLocale=en');assert.equal(local.previewUrl.previewMode.shareAccess,false);assert.deepEqual(Object.keys(local.resolve.locations),['blogPost','blogCategory','siteSettings','homePage','websitePage','feature']);assert.equal(local.resolve.mainDocuments.length,6);process.env.SANITY_STUDIO_BASEPATH='/';assert.equal(load('sanity/presentation/config.ts',imports).presentationPlugin,null);process.env.SANITY_STUDIO_PREVIEW_ORIGIN='https://preview.sedavel.com';assert.deepEqual(load('sanity/presentation/config.ts',imports).presentationPlugin.allowOrigins,['https://preview.sedavel.com']);}finally{for(const [key,value] of [['SANITY_STUDIO_BASEPATH',originals.base],['SANITY_STUDIO_PREVIEW_ORIGIN',originals.origin]])if(value===undefined)delete process.env[key];else process.env[key]=value;}
});
test('live config never passes read tokens to browser and cached preview read requires draft mode',()=>{
 const live=fs.readFileSync('sanity/lib/live.ts','utf8');assert.match(live,/import "server-only"/);assert.match(live,/browserToken: false/);assert.match(live,/strict: true/);const reader=fs.readFileSync('sanity/lib/home-preview.ts','utf8');assert.match(reader,/if \(!\(await draftMode\(\)\).isEnabled \|\| !homeLive\) return null/);assert.match(reader,/"use cache"/);assert.match(reader,/stega: false/);const publicReader=fs.readFileSync('sanity/lib/home-page.ts','utf8');assert.match(publicReader,/perspective: "published"/);assert.doesNotMatch(publicReader,/draftMode|previewClient/);
});
test('Hero edit paths remain language-specific and SEO keeps published content',()=>{
 const hero=fs.readFileSync('components/home-landing.tsx','utf8');assert.match(hero,/preview \? createDataAttribute/);assert.match(hero,/"heroTitleZh" : "heroTitleEn"/);assert.match(hero,/"heroDescriptionZh" : "heroDescriptionEn"/);assert.match(hero,/edit\("heroImage"\)/);const page=fs.readFileSync('app/(website)/page.tsx','utf8');assert.match(page,/seo: content\?\.seo/);assert.match(fs.readFileSync('components/site-preview-runtime.tsx','utf8'),/includeDrafts=\{false\}/);assert.match(fs.readFileSync('app/(website)/layout.tsx','utf8'),/robots: \{ index: false, follow: false \}/);assert.match(fs.readFileSync('components/home-preview-runtime.tsx','utf8'),/router\.refresh\(\)/);
});
