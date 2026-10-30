import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, imports = {}) { const compiled = {exports:{}}; const code = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',code)(n=>imports[n]||require(n),compiled,compiled.exports);return compiled.exports; }
const catalog=load('lib/pricing-catalog.ts');
const safety=load('lib/cms-content.ts');
const page=load('lib/page-cms.ts',{'./cms-content':safety});
const navigation=load('lib/site-navigation.ts');
const settings=load('lib/site-settings-cms.ts',{'./cms-content':safety,'./site-navigation':navigation});
const asset={url:'https://cdn.sanity.io/images/g117cipn/production/image-1200x800.png',width:1200,height:800,altEn:'Image',altZh:'图片'};
const normalize=v=>page.normalizeWebsitePage(v,'g117cipn','production');
test('link allowlist rejects script, protocol-relative, credentials, tracking, unknown routes and Studio targets',()=>{
 for(const s of ['javascript:alert(1)','data:text/html,test','//evil.test','/studio','/api/delete','/register?redirect=https://evil.test','/blog/../studio','https://github.com@evil.test','https://github.com:8443/test','https://evil.test','https://github.com/test?x=1','mailto:a@test.com?subject=x','/features%2f..']) assert.equal(safety.safeHref(s,true),undefined,s);
 for(const s of ['/','/features','/pricing','/blog/real-guide','/features#feature-123'])assert.equal(safety.safeHref(s),s);
 assert.equal(safety.safeHref('https://github.com/sedavel',true),'https://github.com/sedavel');assert.equal(safety.safeHref('https://github.com/sedavel'),undefined);
});
test('safe assets only use this project raster CDN, with controlled crop and display enums',()=>{
 for(const a of [{...asset,url:'https://evil.test/image.png'},{...asset,url:asset.url.replace('g117cipn','other')},{...asset,url:asset.url.replace('.png','.svg')},{...asset,width:-1}])assert.equal(safety.image(a,'g117cipn','production'),undefined);
 const a=safety.image({...asset,crop:{left:.1,right:.1,top:.25,bottom:0},hotspot:{x:.6,y:.5},style:'arbitrary-css',ratio:'wide'},'g117cipn','production');assert.equal(a.width,960);assert.equal(a.height,600);assert.ok(a.url.includes('rect=120%2C200%2C960%2C600'));assert.equal(a.style,'rounded');assert.equal(a.ratio,'wide');
});
test('empty CMS, partial languages and invalid fields keep Features defaults without cross-language substitution',()=>{
 assert.equal(normalize(null),null);assert.equal(normalize({}),null);assert.equal(page.heroProps().en,'Features');assert.equal(page.heroProps().zh,'产品功能');
 const p=normalize({_id:'page-features',hero:{title:{en:'Custom EN'},backgroundStyle:'url(javascript:test)'}});assert.equal(page.heroProps(p.hero).en,'Custom EN');assert.equal(page.heroProps(p.hero).zh,'产品功能');assert.equal(p.hero.backgroundStyle,'brand');assert.equal(p.modules[0].type,'featureSection');assert.equal(page.pageSeo(p,'en').title,'Features | Sedavel');
});
test('module order, explicit hiding and existing public Feature references remain distinct',()=>{
 const p=normalize({modules:[{_key:'last',_type:'ctaBanner',displayOrder:10},{_key:'features',_type:'featureSection',visible:false,displayOrder:2,features:[{_ref:'drafts.secret'},{_ref:'public'}]},{_key:'first',_type:'faqSection',displayOrder:1},{_key:'bad',_type:'html',html:'<script/>'}]});assert.deepEqual(p.modules.map(m=>m.key),['first','features','last']);assert.equal(p.modules[1].visible,false);assert.deepEqual(p.modules[1].features,['public']);
 assert.equal(normalize({modules:[]}).modules[0].type,'featureSection');
});
test('site settings preserve legacy SEO/contact fields, fixed navigation keys and safe social destinations',()=>{
 const s=settings.normalizeSiteSettings({websiteName:'Sedavel',contactEmail:'hello@example.com',seoDefaultTitle:{en:'Default SEO'},navigationItems:[{key:'home',label:{en:'Home label'}},{key:'studio',label:{en:'unsafe'}}],socialLinks:[{url:'https://evil.test',label:{en:'Evil'}},{url:'https://github.com/sedavel',label:{en:'GitHub'}}]},'g117cipn','production');assert.equal(s.seoTitle.en,'Default SEO');assert.equal(s.contactEmail,'hello@example.com');assert.equal(s.navigation.home.en,'Home label');assert.equal(s.navigation.studio,undefined);assert.equal(s.socialLinks.length,1);
});
test('draft/version records are rejected and readers use published request-time data without public write credentials',()=>{
 for(const id of ['drafts.siteSettings','versions.release.siteSettings']){assert.equal(normalize({_id:id,hero:{}}),null);assert.equal(settings.normalizeSiteSettings({_id:id},'g117cipn','production'),null)}
 const reader=fs.readFileSync('sanity/lib/public-content.ts','utf8');assert.match(reader,/await connection\(\)/);assert.match(reader,/perspective: "published"/);assert.match(reader,/cache: "no-store"/);assert.doesNotMatch(reader,/perspective: "drafts"|\.create\(|\.patch\(|\.delete\(/);
});
test('Features singleton initializes a fixed route and allows repairing existing empty drafts without removing validation',()=>{
 const schema=load('sanity/schemaTypes/page-content.ts',{'sanity':{defineType:v=>v,defineField:v=>v,defineArrayMember:v=>v,getPublishedId:id=>id.replace(/^drafts\./,'')},'@/lib/cms-content':safety,'@/lib/pricing-catalog':catalog,'@/lib/download-platforms':load('lib/download-platforms.ts')}).websitePage;
 const field=schema.fields.find(f=>f.name==='pageKey');assert.equal(schema.initialValue.pageKey,'features');assert.equal(field.initialValue,'features');assert.equal(field.readOnly({value:undefined}),false);assert.equal(field.readOnly({value:null}),false);assert.equal(field.readOnly({value:'features'}),true);assert.deepEqual(field.options.list.map(v=>v.value),['features','pricing','download','referral']);assert.equal(field.readOnly({value:'pricing',document:{_id:'page-pricing'}}),true);assert.equal(field.readOnly({value:'features',document:{_id:'page-pricing'}}),false);
 let required=false,checkRoute;field.validation({required(){required=true;return this},custom(fn){checkRoute=fn;return this}});assert.equal(required,true);assert.equal(checkRoute('features',{document:{_id:'page-features'}}),true);assert.equal(typeof checkRoute('pricing',{document:{_id:'page-features'}}),'string');assert.equal(schema.preview.prepare().title,'Features Page / 功能页内容');
 let validate;schema.validation({custom(fn){validate=fn;return this}});assert.equal(validate({_id:'drafts.page-features'}),true);assert.equal(validate({_id:'page-features'}),true);assert.equal(typeof validate({_id:'random-duplicate'}),'string');
 for(const name of ['hero','modules','seo','displayCopy'])assert.ok(schema.fields.find(f=>f.name===name));
 const structure=fs.readFileSync('sanity/structure.ts','utf8');assert.match(structure,/documentId\("page-features"\).*initialValueTemplate\("features-page"\)/);
});

test('legacy navigation keeps its order, while explicit visibility and sort controls are applied safely',()=>{
 assert.deepEqual(settings.resolveNavigation(null).map(p=>p.key),navigation.publicNavigation.map(p=>p.key));
 const legacy=settings.normalizeSiteSettings({navigationItems:[{key:'features',label:{en:'Capabilities'}}]},'g117cipn','production');assert.equal(settings.resolveNavigation(legacy)[1].label.en,'Capabilities');assert.equal(settings.resolveNavigation(legacy)[0].key,'home');
 const s=settings.normalizeSiteSettings({navigationItems:[{key:'blog',visible:false},{key:'pricing',displayOrder:5},{key:'javascript:alert(1)',href:'javascript:alert(1)'},{key:'features',href:'https://evil.test'}]},'g117cipn','production');
 assert.deepEqual(settings.resolveNavigation(s).slice(0,3).map(p=>p.key),['home','pricing','features']);assert.ok(!settings.resolveNavigation(s).some(p=>p.key==='blog'));assert.equal(settings.resolveNavigation(s).find(p=>p.key==='features').href,'/features');
});
test('footer groups select only existing routes, preserve legal notices, and allow intentional hiding',()=>{
 const s=settings.normalizeSiteSettings({footerGroups:[{_key:'group',title:{en:'Explore'},links:[{page:'privacy'},{page:'studio'},{page:'features',visible:false},{page:'terms',showLegalNotice:false},{page:'privacy'}]}]},'g117cipn','production');assert.deepEqual(s.footerGroups[0].links.map(l=>l.href),['/privacy','/terms']);assert.equal(s.footerGroups[0].links[0].showLegalNotice,true);assert.equal(s.footerGroups[0].links[1].showLegalNotice,false);
 assert.equal(settings.normalizeSiteSettings({footerGroups:[]},'g117cipn','production').footerGroups,undefined);assert.deepEqual(settings.normalizeSiteSettings({footerGroups:[{visible:false}]},'g117cipn','production').footerGroups,[]);
});
test('language labels, brand, copyright and default SEO use matching-language data with safe fallbacks',()=>{
 const s=settings.normalizeSiteSettings({websiteName:'Sedavel',websiteNameLocalized:{zh:'Sedavel 中文'},languageLabels:{english:{en:'English',zh:'英文'},chinese:{en:'Chinese',zh:'中文'}},footerCopyright:{en:'© {year} {websiteName}'},seoDefaultTitle:{en:'Global EN'},seoDefaultDescription:{zh:'全局描述'},seoDefaultImageEn:asset,seoDefaultImageZh:{...asset,altZh:'中文分享图'}},'g117cipn','production');
 assert.equal(s.languageLabels.english.zh,'英文');assert.equal(settings.websiteName(s,'en'),'Sedavel');assert.equal(settings.websiteName(s,'zh'),'Sedavel 中文');assert.deepEqual(settings.resolveDefaultSeo(s,'zh',{title:'Fallback',description:'Fallback description'}),{title:'Fallback',description:'全局描述'});assert.equal(settings.defaultOpenGraph(s,'zh').images[0].alt,'中文分享图');
 const p=normalize({seo:{titleEn:'Page wins'}});assert.equal(page.pageSeo(p,'en',settings.resolveDefaultSeo(s,'en',{title:'fallback',description:'fallback'})).title,'Page wins');assert.equal(page.pageSeo(p,'en',settings.resolveDefaultSeo(s,'en',{title:'fallback',description:'fallback'})).description,'fallback');
 const h=load('lib/home-cms.ts',{'@/lib/home-content':load('lib/home-content.ts')});assert.equal(h.resolveHomeSeo('en',{seo:{titleEn:'Hero page wins'}},{title:'Global',description:'Global description'}).title,'Hero page wins');assert.equal(h.resolveHomeSeo('en',null,{title:'Global',description:'Global description'}).title,'Global');
});
test('Site Settings singleton has an explicit template and no new required read-only fields',()=>{
 const schema=load('sanity/schemaTypes/site-settings.ts',{'sanity':{defineType:v=>v,defineField:v=>v,defineArrayMember:v=>v,getPublishedId:id=>id.replace(/^drafts\./,'')},'@/lib/cms-content':safety,'@/lib/site-navigation':navigation,'@/lib/i18n':load('lib/i18n.ts',{'./pricing-catalog':catalog})}).siteSettings;
 assert.equal(schema.initialValue.navigationItems.length,8);assert.equal(schema.initialValue.defaultLanguage,'en');assert.equal(schema.preview.prepare().title,'Site Settings / 网站设置');assert.ok(!schema.fields.some(f=>f.readOnly===true));
 assert.match(fs.readFileSync('sanity/structure.ts','utf8'),/documentId\("siteSettings"\).*initialValueTemplate\("site-settings"\)/);
});
