/* ORIGIN V11.1 — Shared cinematic art director.
 * Pure editorial illustrations; never reproductions of real film frames or archival images.
 * No creator-specific code: each composition is chosen by scene metadata, not person id.
 */
(()=>{
'use strict';
const styles=Object.freeze({
 field:{label:'LANDSCAPE STUDY',description:'An invented visual landscape; no film frame or historical location image',layers:['sky','ground','reed','reed-two','distant']},
 absence:{label:'NEGATIVE SPACE',description:'Illustration of absence using light and shadow',layers:['shadow','threshold','light-cut']},
 studio:{label:'STUDIO LIGHT STUDY',description:'An original illustration of light and perspective in a working space',layers:['rig','light-beam','set-floor']},
 paper:{label:'PRINT AND DRAWING',description:'Fictional printed artwork and geometric ink marks',layers:['page','print-line','print-line-two','stamp']},
 frame:{label:'COMPOSITION STUDY',description:'An invented camera composition, not a film still',layers:['matte','viewfinder','subject','depth']},
 sound:{label:'SOUND AND RHYTHM',description:'Abstract musical rhythm, not an original score or waveform',layers:['score','score-two','pulse','pulse-two']},
 negative:{label:'FILM MATERIAL STUDY',description:'Entirely synthetic film material, not an archival negative',layers:['film','film-cut','scratch']},
 archive:{label:'THE MATERIAL ARCHIVE',description:'An imaginary study of archive storage and physical records',layers:['drawer','document','document-two','index-tab']},
 map:{label:'GEOGRAPHY AND JOURNEY',description:'An invented cartographic pattern, not a period-accurate map',layers:['grid','route','destination']},
 ensemble:{label:'PEOPLE AND PLACE',description:'Abstract silhouettes, not depictions of historical individuals',layers:['figure','figure-two','figure-three','stage-line']},
 abstract:{label:'EDITORIAL LIGHT STUDY',description:'Original symbolic composition, not a historical photograph',layers:['orb','column','light-cut']}
});
const map={
 // A scene can opt in explicitly with a supported visualTemplate name.
 field:'field',empty:'absence',loss:'absence',sacrifice:'absence',farewell:'absence',
 crew:'studio',set:'studio',work:'studio',study:'paper',letters:'paper',print:'paper',paper:'paper',
 books:'paper',drawing:'paper',design:'paper',painting:'paper',
 filmstrip:'negative',negative:'negative',fire:'negative',fragile:'negative',restore:'negative',
 music:'sound',sound:'sound',rhythm:'sound',score:'sound',song:'sound',
 archive:'archive',papers:'archive',society:'archive',
 map:'map',journey:'map',travel:'map',landscape:'field',village:'field',
 ensemble:'ensemble',cast:'ensemble',family:'ensemble',team:'ensemble',
 frame:'frame',screen:'frame',cinema:'frame',projection:'frame',
 first:'frame',perspective:'frame',honor:'abstract',symbol:'abstract',
 colour:'abstract',color:'abstract'
};
function identify(scene){
 if(scene&&typeof scene.visualTemplate==='string'&&Object.hasOwn(styles,scene.visualTemplate))return scene.visualTemplate;
 for(const value of [scene?.mode,scene?.kind]){
  if(typeof value==='string'&&Object.hasOwn(map,value))return map[value];
 }
 return 'abstract';
}
function direction(scene,index=0){
 const template=identify(scene),spec=styles[template];
 // Modest, repeatable variation in angles/scale between scenes using the same template.
 // Index only affects illustration. No random source images or invented historic evidence.
 const step=((Number(index)||0)%7+7)%7;
 const angle=[-9,-5,-2,0,3,7,11][step];
 const shift=[-3,0,4,-2,2,-4,3][step];
 return {template,label:spec.label,description:spec.description,layers:spec.layers,
   angle,shift};
}
function mount(host,stage,scene,index){
 if(!host||!stage)throw new Error('Visual director requires a stage and illustration host');
 const spec=direction(scene,index);
 stage.dataset.visual=spec.template;
 stage.style.setProperty('--visual-tilt',spec.angle+'deg');
 stage.style.setProperty('--visual-shift',spec.shift+'%');
 const fragment=document.createDocumentFragment();
 for(const name of spec.layers){
  const node=document.createElement('span');
  node.className='visual-shape visual-'+name;
  node.setAttribute('aria-hidden','true');
  fragment.append(node);
 }
 host.replaceChildren(fragment);
 host.dataset.template=spec.template;
 return spec;
}
window.ORIGIN_VISUAL_DIRECTOR=Object.freeze({direction,mount,templates:Object.keys(styles)});
})();