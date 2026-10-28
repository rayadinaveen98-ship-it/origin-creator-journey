/* ORIGIN V11.3 — opt-in local preview bridge.
 * Does not upload data or make a studio draft public. Runtime loads only in this browser
 * and only with an explicit ?draft=1&person=studio-local URL.
 */
(()=>{'use strict';
const q=new URLSearchParams(location.search);
if(q.get('draft')!=='1'||q.get('person')!=='studio-local')return;
const schema=window.ORIGIN_STUDIO_SCHEMA,registry=window.ORIGIN_V11;
if(!schema||!registry)return;
try{
 const raw=localStorage.getItem(schema.DRAFT_KEY);
 if(!raw||raw.length>schema.MAX_BYTES)throw Error('Missing or oversized draft');
 const compiled=schema.compile(JSON.parse(raw));
 registry.registerCreator(compiled.profile);
 for(const act of compiled.acts)registry.registerAct(act);
}catch(error){
 // No partial creator registration on failed validation: compile precedes writes.
 // The main player will show the normal catalogue if draft is unavailable.
 const el=document.createElement('div');el.className='studio-preview-error';
 el.textContent='Local studio preview unavailable. Open Creator Studio to validate or restore your draft.';
 el.setAttribute('role','alert');
 const app=document.getElementById('app');
 if(app)app.prepend(el);
}
})();