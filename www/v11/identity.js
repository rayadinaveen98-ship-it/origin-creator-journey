/* ORIGIN V11.2: editorial art direction supplied as data, never creator-specific runtime branches.
 * Restrictive tokens prevent a biography file from injecting CSS/HTML into the player.
 */
(()=>{'use strict';
const allowed={
 typography:['literary','graphic','neutral'],
 composition:['observational','angular','balanced'],
 motion:['dissolve','cut','steady']
};
const colorPattern=/^#[0-9a-fA-F]{6}$/;
const defaults=Object.freeze({
 accent:'#e1b981',glow:'#785b48',shadow:'#101b21',paper:'#f6ebdc',
 typography:'literary',composition:'balanced',motion:'steady',
 signature:'ORIGINAL CINEMATIC PORTRAIT'
});
function identity(profile){
 const source=profile?.identity||{};
 if(!source||typeof source!=='object'||Array.isArray(source))throw Error('Identity must be an object');
 const result={};
 for(const name of ['accent','glow','shadow','paper']){
  const value=source[name]??(name==='accent'?profile?.accent:undefined)??defaults[name];
  if(typeof value!=='string'||!colorPattern.test(value))throw Error('Invalid identity color: '+name);
  result[name]=value.toLowerCase();
 }
 for(const name of ['typography','composition','motion']){
  const value=source[name]??defaults[name];
  if(!allowed[name].includes(value))throw Error('Invalid cinematic identity: '+name);
  result[name]=value;
 }
 const signature=source.signature??defaults.signature;
 if(typeof signature!=='string'||signature.length>52||!/^[A-Za-z0-9 &·.,'-]+$/.test(signature))throw Error('Invalid cinematic identity signature');
 result.signature=signature;
 return Object.freeze(result);
}
function apply(element,profile){
 const i=identity(profile);
 if(!element)throw Error('Identity target missing');
 element.dataset.typography=i.typography;
 element.dataset.composition=i.composition;
 element.dataset.motion=i.motion;
 for(const key of ['accent','glow','shadow','paper'])element.style.setProperty('--identity-'+key,i[key]);
 element.style.setProperty('--accent',i.accent);
 return i;
}
function transitionMilliseconds(profile,reducedMotion){
 if(reducedMotion)return 0;
 return {cut:92,dissolve:245,steady:165}[identity(profile).motion];
}
window.ORIGIN_CINEMATIC_IDENTITY=Object.freeze({identity,apply,transitionMilliseconds,allowed:Object.freeze(allowed)});
})();