import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
function load(file,imports={}){const m={exports:{}};const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',js)(n=>Object.hasOwn(imports,n)?imports[n]:require(n),m,m.exports);return m.exports;}
const safe=load('lib/cms-content.ts'),pages=load('lib/page-cms.ts',{'./cms-content':safe}),catalog=load('lib/pricing-catalog.ts');
const prices=load('lib/pricing-cms.ts',{'./cms-content':safe,'./page-cms':pages,'./pricing-catalog':catalog});
const i18n=load('lib/i18n.ts',{'./pricing-catalog':catalog});
test('preview keeps reviewed financial data immutable while retaining stable marketing card keys',()=>{
 const p=prices.normalizePricingContent({_id:'page-pricing',pageKey:'pricing',pricing:{cards:[{_key:'standard-card',planKey:'standard',price:'$0',quota:'UNLIMITED',description:{en:'Draft marketing',zh:'草稿营销'},buttonText:{en:'Draft button'}}]}},'g117cipn','production');
 assert.equal(p.pricing.cards.standard.sourceKey,'standard-card');for(const locale of ['en','zh']){const r=prices.resolvePricingCopy(p.pricing,locale,i18n.dictionaries[locale].pricing);assert.deepEqual(r.plans.map(p=>[p.name,p.quota,p.price]),[['Free','50,000','$0'],['Starter','300,000','$11.90'],['Standard','1,500,000','$54.90'],['Pro','5,000,000','$169.00'],['Business','15,000,000','$459.00']]);assert.deepEqual(r.plans.filter(p=>p.featured).map(p=>p.key),['standard']);}
 assert.equal(prices.normalizePricingContent({_id:'drafts.page-pricing',pageKey:'pricing'},'g117cipn','production'),null);
});
test('Features/Pricing share existing authenticated Live integration with no new auth and the same draft guard',()=>{
 const r=fs.readFileSync('sanity/lib/page-preview.ts','utf8');assert.match(r,/\(await draftMode\(\)\).isEnabled/);assert.match(r,/resolvePerspectiveFromCookies/);assert.match(r,/"use cache"/);assert.match(r,/homeLive\.sanityFetch/);assert.match(r,/stega: false/);assert.doesNotMatch(r,/defineEnableDraftMode|createClient/);
 for(const route of ['features','pricing']){const s=fs.readFileSync(`app/(website)/${route}/page.tsx`,'utf8');assert.match(s,/PagePreviewRuntime/);assert.match(s,/seo: content\?/);const metadata=s.slice(s.indexOf('export async function generateMetadata'),s.indexOf('async function Published'));assert.doesNotMatch(metadata,/getFeaturesPreview|getPricingPreview/)}
});
test('edit context accepts stable array keys and is disabled without an authorized provider',()=>{
 const c=load('components/cms-edit-context.tsx',{'react':{createContext:()=>null,useContext:()=>null},'react/jsx-runtime':{jsx:()=>null},'next-sanity':{createDataAttribute:()=>{throw Error('No data attribute outside preview')}},'@/sanity/env':{dataset:'production',projectId:'g117cipn'}});
 assert.equal(c.keyedPath('modules','abc_123'),'modules[_key=="abc_123"]');assert.equal(c.keyedPath('modules','bad"]'),undefined);assert.equal(c.useCmsEdit()('hero.title.en'),undefined);
 const cards=fs.readFileSync('components/home-page.tsx','utf8');assert.doesNotMatch(cards,/<span[^>]*data-sanity[^>]*>\s*\{plan.price\}/);assert.match(cards,/source\?\.sourceKey/);assert.match(cards,/href="\/register" className="mt-8 w-full"/);
});
test('FAQ item mapping retains original array positions and default modules do not gain edit attributes',()=>{
 const s=fs.readFileSync('components/page-modules.tsx','utf8');assert.doesNotMatch(s,/m\.items\.filter/);assert.match(s,/items\[\$\{i\}\]\.question/);assert.match(s,/m.sourceKey/);assert.match(s,/keyedPath\("modules", m.sourceKey\)/);
 const feature=fs.readFileSync('components/feature-showcase.tsx','utf8');assert.match(feature,/preview && !record.isFallback/);assert.match(feature,/"nameZh" : "nameEn"/);assert.match(feature,/edit\("image"\)/);
});
