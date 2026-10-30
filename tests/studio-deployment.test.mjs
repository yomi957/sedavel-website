import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const load=(file,imports)=>{const m={exports:{}};const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',js)(n=>{if(!Object.hasOwn(imports,n))throw Error(n);return imports[n]},m,m.exports);return m.exports.default;};
const imports={'sanity':{defineConfig:v=>v},'sanity/structure':{structureTool:()=>({})},'@/sanity/env':{isSanityConfigured:true,projectId:'g117cipn',dataset:'production'},'@/sanity/schemaTypes':{schemaTypes:[{name:'existing-schema'}]},'@/sanity/presentation/config':{presentationPlugin:null},'@/sanity/structure':{structure:()=>({})},'@/sanity/schemaTypes/site-settings':{siteSettingsInitialValue:{}}};
test('one config preserves embedded /studio and standalone / without duplicating schemas or singleton templates',()=>{
 const original=process.env.SANITY_STUDIO_BASEPATH;
 try{delete process.env.SANITY_STUDIO_BASEPATH;const embedded=load('sanity.config.ts',imports);process.env.SANITY_STUDIO_BASEPATH='/';const standalone=load('sanity.config.ts',imports);assert.equal(embedded.basePath,'/studio');assert.equal(standalone.basePath,'/');assert.deepEqual(embedded.schema.types,standalone.schema.types);assert.deepEqual(embedded.schema.templates([]),standalone.schema.templates([]));assert.equal(standalone.projectId,'g117cipn');assert.equal(standalone.dataset,'production');assert.equal(standalone.auth,undefined)}finally{if(original===undefined)delete process.env.SANITY_STUDIO_BASEPATH;else process.env.SANITY_STUDIO_BASEPATH=original;}
});
test('standalone Vite exposes only three public identifiers and preserves existing aliases and definitions',()=>{
 const config=load('sanity.cli.ts',{'@next/env':{loadEnvConfig:()=>{}},'sanity/cli':{defineCliConfig:v=>v}});const v=config.vite({define:{existing:'true'},resolve:{alias:{existing:'/existing'}}});assert.deepEqual(Object.keys(v.define).sort(),['existing','process.env.NEXT_PUBLIC_SANITY_API_VERSION','process.env.NEXT_PUBLIC_SANITY_DATASET','process.env.NEXT_PUBLIC_SANITY_PROJECT_ID'].sort());assert.ok(!Object.keys(v.define).some(k=>/TOKEN|PASSWORD|SECRET/.test(k)));assert.deepEqual(v.resolve.alias,[{find:'@',replacement:process.cwd()},{find:'existing',replacement:'/existing'}]);
});
test('standalone artifacts are ignored and launch scripts use the already-installed CLI',()=>{
 assert.match(fs.readFileSync('.gitignore','utf8'),/^\/dist\/$/m);assert.match(fs.readFileSync('eslint.config.mjs','utf8'),/"dist\/\*\*"/);const s=fs.readFileSync('scripts/studio.mjs','utf8');assert.match(s,/SANITY_STUDIO_BASEPATH: "\/"/);assert.match(s,/@sanity\/cli\/package.json/);assert.doesNotMatch(s,/npx|npm install|SANITY_AUTH_TOKEN:/);
});
