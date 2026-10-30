import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
function load(file,imports={}){const compiled={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',code)(n=>Object.hasOwn(imports,n)?imports[n]:require(n),compiled,compiled.exports);return compiled.exports;}
const safety=load('lib/cms-content.ts'),catalog=load('lib/pricing-catalog.ts');
const pages=load('lib/page-cms.ts',{'./cms-content':safety});
const helpers=load('lib/pricing-cms.ts',{'./cms-content':safety,'./page-cms':pages,'./pricing-catalog':catalog});
const dictionaries=load('lib/i18n.ts',{'./pricing-catalog':catalog}).dictionaries;
const expected=[['Free','50,000','$0'],['Starter','300,000','$11.90'],['Standard','1,500,000','$54.90'],['Pro','5,000,000','$169.00'],['Business','15,000,000','$459.00']];
const normalize=v=>helpers.normalizePricingContent(v,'g117cipn','production');
const resolve=(p,locale)=>helpers.resolvePricingCopy(p?.pricing,locale,dictionaries[locale].pricing);
test('approved five-plan prices and character quantities are exact and identical in both languages',()=>{
 for(const locale of ['en','zh']){const copy=resolve(null,locale);assert.deepEqual(copy.plans.map(p=>[p.name,p.quota,p.price]),expected);assert.deepEqual(copy.plans.filter(p=>p.featured).map(p=>p.name),['Standard']);assert.deepEqual(dictionaries[locale].pricing.plans.map(p=>[p.name,p.quota,p.price]),expected);assert.doesNotMatch(copy.billed,/monthly|按月/);assert.doesNotMatch(copy.characters,/month|月/)}
});
test('unpublished, wrong singleton and empty data keep static Pricing and never expose drafts',()=>{
 for(const v of [null,{}, {_id:'drafts.page-pricing',pageKey:'pricing'},{_id:'page-features',pageKey:'features'},{_id:'page-pricing',pageKey:'features'}])assert.equal(normalize(v),null);
 assert.equal(pages.heroProps(undefined,{en:'Pricing',zh:'价格'}).en,'Pricing');assert.equal(helpers.pricingPageSeo(null,'en').title,'Pricing | Sedavel');
});
test('CMS can replace marketing copy but cannot override names, prices, quotas, order or recommended status',()=>{
 const p=normalize({_id:'page-pricing',pageKey:'pricing',pricing:{title:{en:'CMS title'},cards:[{planKey:'free',name:'Unlimited',price:'$999',quota:'999,999,999',featured:true,description:{en:'Free marketing'}},{planKey:'standard',price:'$1',quota:'2',featured:false,description:{en:'Standard marketing'},benefitsEn:['CMS benefit']},{planKey:'untrusted',price:'$0'},{planKey:'standard',description:{en:'Duplicate should not win'}}]}});
 for(const locale of ['en','zh']){const c=resolve(p,locale);assert.deepEqual(c.plans.map(p=>[p.name,p.quota,p.price]),expected);assert.deepEqual(c.plans.filter(p=>p.featured).map(p=>p.key),['standard'])}
 assert.equal(resolve(p,'en').plans[2].description,'Standard marketing');assert.equal(resolve(p,'zh').plans[2].description,catalog.pricingCatalog[2].description.zh);assert.equal(resolve(p,'zh').title,dictionaries.zh.pricing.title);assert.deepEqual(resolve(p,'en').plans[2].points,['CMS benefit']);assert.equal('price' in p.pricing.cards.standard,false);
});
test('FAQ and CTA defaults survive absent content; explicit visibility and order are respected',()=>{
 const empty=normalize({_id:'page-pricing',pageKey:'pricing',modules:[]});assert.deepEqual(empty.page.modules.map(m=>m.type),['faqSection','ctaBanner']);
 const p=normalize({_id:'page-pricing',pageKey:'pricing',modules:[{_key:'hide',_type:'faqSection',visible:false},{_key:'cta',_type:'ctaBanner',displayOrder:2,title:{en:'CMS CTA'}},{_key:'image',_type:'imageTextSection',displayOrder:1},{_key:'features',_type:'featureSection'}]});assert.deepEqual(p.page.modules.map(m=>m.key),['image','cta']);
});
test('pricing media, icons and actions use controlled fields and unsafe values are dropped',()=>{
 const p=normalize({_id:'page-pricing',pageKey:'pricing',hero:{backgroundStyle:'url(javascript:alert(1))',primaryAction:{label:{en:'Unsafe'},href:'javascript:alert(1)'}},pricing:{cards:[{planKey:'standard',icon:{name:'<svg onload=alert(1)>'},image:{url:'https://evil.test/image.svg',width:100,height:100}}]},modules:[{_key:'cta',_type:'ctaBanner',primaryAction:{label:{en:'Unsafe'},href:'//evil.test'}}]});assert.equal(p.page.hero.backgroundStyle,'brand');assert.equal(p.page.hero.primaryAction,undefined);assert.equal(p.pricing.cards.standard.image,undefined);assert.equal(p.pricing.cards.standard.icon.name,'check');assert.equal(p.page.modules.find(m=>m.type==='ctaBanner').primaryAction,undefined);
});
test('Pricing reuses the websitePage singleton and its schema exposes no financial override fields',()=>{
 const schema=load('sanity/schemaTypes/page-content.ts',{'sanity':{defineType:v=>v,defineField:v=>v,defineArrayMember:v=>v,getPublishedId:id=>id.replace(/^drafts\./,'')},'@/lib/cms-content':safety,'@/lib/pricing-catalog':catalog,'@/lib/download-platforms':load('lib/download-platforms.ts')}).websitePage;
 assert.equal(schema.name,'websitePage');assert.equal(schema.preview.prepare({id:'drafts.page-pricing'}).title,'Pricing Page / 价格页内容');const key=schema.fields.find(f=>f.name==='pageKey');assert.equal(key.readOnly({value:'pricing',document:{_id:'page-pricing'}}),true);let check;key.validation({required(){return this},custom(fn){check=fn;return this}});assert.equal(check('pricing',{document:{_id:'page-pricing'}}),true);assert.equal(typeof check('features',{document:{_id:'page-pricing'}}),'string');
 const copy=schema.fields.find(f=>f.name==='pricing');const card=copy.fields.find(f=>f.name==='cards').of[0];assert.deepEqual(card.fields.find(f=>f.name==='planKey').options.list.map(v=>v.value),catalog.pricingCatalog.map(p=>p.key));for(const field of ['price','amount','quota','currency','featured','name'])assert.ok(!card.fields.some(f=>f.name===field));
 const config=load('sanity.config.ts',{'sanity':{defineConfig:v=>v},'sanity/structure':{structureTool:()=>({})},'@/sanity/env':{isSanityConfigured:true,projectId:'g117cipn',dataset:'production'},'@/sanity/schemaTypes':{schemaTypes:[]},'@/sanity/presentation/config':{presentationPlugin:null},'@/sanity/structure':{structure:()=>({})},'@/sanity/schemaTypes/site-settings':{siteSettingsInitialValue:{}}}).default;
 assert.equal(config.schema.templates([]).find(t=>t.id==='pricing-page').value.pageKey,'pricing');assert.ok(config.document.newDocumentOptions([{templateId:'pricing-page'}]).length===0);assert.match(fs.readFileSync('sanity/structure.ts','utf8'),/documentId\("page-pricing"\).*initialValueTemplate\("pricing-page"\)/);
});
test('Pricing reader only fetches published content at request time',()=>{const s=fs.readFileSync('sanity/lib/public-content.ts','utf8');assert.match(s,/getPublishedPricingPage = cache\(async/);assert.match(s,/fetch<unknown>\(pricingPageQuery, \{\}, \{ perspective: "published", cache: "no-store" \}\)/);assert.doesNotMatch(s,/\.create\(|\.patch\(|\.delete\(/)});
