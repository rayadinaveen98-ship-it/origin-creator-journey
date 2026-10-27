/* ORIGIN V7 Alpha 01. Connected, local-first learner shell.
   /story-first/ and / remain separate, frozen experiences. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'origin_v7_alpha_01';
  const MIN_DATE = '1955—1959';
  const defaults = () => ({version:1, journeyVisits:0, studioVisits:0, lastPart:0, lastScene:'', notes:[]});
  let state = defaults();
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (stored && stored.version === 1 && Array.isArray(stored.notes)) {
      state = {...defaults(), ...stored, notes: stored.notes.slice(0, 200)};
    }
  } catch { /* browser storage may be disabled */ }
  const safeSave = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch { return false; }
  };
  const ui = {
    stage: $('stage'), figureA:document.querySelector('.figure-a'), figureB:document.querySelector('.figure-b'),
    stageLight:document.querySelector('.stage-light'), distance:$('distance'), light:$('lightLevel'),
    notes:$('notesList'), dialogue:$('experience'), story:$('storyFrame'), legacy:$('legacyFrame')
  };
  let currentView = 'journey', currentLab = 'composition', activeExperience = '', restoreFocus = null;
  let storyReady = false, legacyReady = false, observerTimer = null;

  function view(which, focus = false) {
    if (!['journey','studio','notebook'].includes(which)) return;
    currentView = which;
    document.querySelectorAll('.view').forEach(el => { el.hidden = el.id !== 'view-' + which; });
    document.querySelectorAll('.top-nav [data-view]').forEach(el => {
      if (el.dataset.view === which) el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    if (which === 'notebook') renderNotebook();
    if (which === 'studio') {
      state.studioVisits = Math.max(0, Number(state.studioVisits) || 0) + 1;
      safeSave();
    }
    window.scrollTo({top:0,behavior:'instant'});
    if (focus) $('view-' + which).setAttribute('tabindex','-1'), $('view-' + which).focus({preventScroll:true});
  }
  function studio(lab) {
    if (!['composition','lighting'].includes(lab)) return;
    currentLab = lab;
    document.querySelectorAll('[role="group"] [data-lab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lab === lab)));
    $('lab-composition').hidden = lab !== 'composition';
    $('lab-lighting').hidden = lab !== 'lighting';
    ui.stage.classList.toggle('lighting',lab === 'lighting');
    ui.stage.classList.toggle('composition',lab === 'composition');
    $('monitorLabel').textContent = lab === 'composition' ? 'COMPOSITION STUDY' : 'LIGHTING STUDY';
    $('studioStatus').textContent = '';
    renderStage();
  }
  function renderStage() {
    const d = Number(ui.distance.value);
    const l = Number(ui.light.value);
    $('distanceValue').textContent = d + '%';
    $('lightValue').textContent = l + '%';
    const sep = d * .37;
    ui.figureA.style.left = (50 - sep) + '%';
    ui.figureB.style.left = (50 + sep) + '%';
    ui.stageLight.style.opacity = currentLab === 'lighting' ? String((100 - l)/124) : '0';
    $('compositionReading').textContent =
      d < 30 ? 'Closer figures might suggest connection, comfort or an uneasy lack of personal space.' :
      d < 61 ? 'A space between the figures invites us to wonder what remains unsaid.' :
      'Now emptiness dominates the frame. Is this independence, separation or grief? The story decides.';
    $('lightingReading').textContent =
      l < 34 ? 'Much of the room disappears. Darkness draws attention to what is missing.' :
      l < 68 ? 'Dim light makes the room feel withdrawn, as if the gathering has ended.' :
      'The illuminated room suggests ceremony and presence, but can also make an empty room feel exposed.';
  }

  function updateProgressHint(){
    const progress = state.lastPart >= 1 ?
      ('Last explored: Part ' + state.lastPart + (state.lastScene ? ' · Scene ' + state.lastScene : '') + ' · In-tab scene position persists only while this page stays open') :
      ('Journey opens from its original introduction');
    $('progressHint').textContent = progress;
  }
  function watchStory() {
    if (activeExperience !== 'story') return;
    try {
      const doc = ui.story.contentDocument;
      if (!doc || doc.location.href === 'about:blank') return;
      const part3 = doc.getElementById('origin16');
      const part2 = doc.getElementById('origin15');
      const nextPart = part3 && !part3.hidden ? 3 : part2 && !part2.hidden ? 2 : 1;
      const rawScene = nextPart === 3 ?
        (doc.getElementById('o16ActNumber')?.textContent || '') :
        nextPart === 2 ? (doc.getElementById('o15ActNumber')?.textContent || '') : '';
      const scene = rawScene.trim().slice(0,40);
      if (nextPart !== state.lastPart || scene !== state.lastScene) {
        state.lastPart = nextPart;
        state.lastScene = scene;
        safeSave();
        updateProgressHint();
      }
    } catch {
      // If a browser blocks iframe inspection, the original journey still works.
      // We never try to force a chapter's hidden state or rewrite its scripts.
    }
  }
  function experience(mode) {
    if (mode !== 'story' && mode !== 'legacy') return;
    restoreFocus = document.activeElement;
    activeExperience = mode;
    ui.dialogue.hidden = false;
    document.body.classList.add('experience-open');
    document.querySelector('.app-shell').inert = true;
    const isStory = mode === 'story';
    ui.story.hidden = !isStory;
    ui.legacy.hidden = isStory;
    $('experienceTitle').textContent = isStory ? "Ray's creator journey" : 'ORIGIN / The original studio worlds';
    $('experienceSub').textContent = isStory ? MIN_DATE + ' · Story-First 1.6' : 'V6 frozen release · Studio and interactive worlds';
    if (isStory) {
      state.journeyVisits = Math.max(0, Number(state.journeyVisits) || 0) + 1;
      safeSave();
      if (!storyReady) { ui.story.src = '/story-first/'; storyReady = true; }
      updateProgressHint();
      if (!observerTimer) observerTimer = setInterval(watchStory, 1400);
    } else {
      $('progressHint').textContent = 'Original V6 preserved';
      if (!legacyReady) { ui.legacy.src = '/'; legacyReady = true; }
    }
    $('closeExperience').focus();
  }
  function closeExperience() {
    if (ui.dialogue.hidden) return;
    watchStory();
    activeExperience = '';
    if (observerTimer) {clearInterval(observerTimer); observerTimer = null;}
    ui.dialogue.hidden = true;
    document.querySelector('.app-shell').inert = false;
    document.body.classList.remove('experience-open');
    if (restoreFocus && restoreFocus.isConnected) restoreFocus.focus();
  }
  function renderNotebook() {
    $('journeyVisits').textContent = String(state.journeyVisits || 0);
    $('studioVisits').textContent = String(state.studioVisits || 0);
    $('savedCount').textContent = String(state.notes.length);
    $('noteCount').textContent = String(state.notes.length);
    $('exportNotes').disabled = !state.notes.length;
    ui.notes.replaceChildren();
    if (!state.notes.length) {
      const p=document.createElement('p');p.className='empty';
      p.textContent='No discoveries saved yet. Try an experiment in the Studio.';
      ui.notes.append(p);return;
    }
    state.notes.slice().reverse().forEach(note => {
      const article = document.createElement('article'); article.className='note-card';
      const label = document.createElement('span'); label.className='meta';
      label.textContent = note.lab === 'lighting' ? 'LIGHTING / JALSAGHAR' : 'COMPOSITION / APUR SANSAR';
      const heading = document.createElement('h3'); heading.textContent = note.lab === 'lighting' ? 'Atmosphere study' : 'Distance study';
      const p = document.createElement('p'); p.textContent = note.text;
      const footer=document.createElement('footer');
      const when=document.createElement('time');
      const dt=new Date(note.date);
      when.textContent=Number.isNaN(dt.valueOf())?'Saved discovery':dt.toLocaleString();
      if (!Number.isNaN(dt.valueOf())) when.dateTime=dt.toISOString();
      const del=document.createElement('button');del.type='button';del.textContent='Delete';del.setAttribute('aria-label','Delete this discovery');
      del.addEventListener('click',()=>{if(!window.confirm('Delete this saved discovery from this browser?'))return;state.notes=state.notes.filter(n=>n.id!==note.id);safeSave();renderNotebook();});
      footer.append(when,del);article.append(label,heading,p,footer);ui.notes.append(article);
    });
  }
  function saveLab() {
    const text=$('labReflection').value.trim();
    if (!text) { $('studioStatus').textContent='Write a discovery to save this study.'; $('labReflection').focus();return; }
    const value = currentLab === 'lighting' ? Number(ui.light.value) : Number(ui.distance.value);
    const note = {id: (window.crypto?.randomUUID?.() || Date.now() + '-' + Math.random()),date:new Date().toISOString(),lab:currentLab,value,text:text.slice(0,1200)};
    state.notes.push(note);
    if (state.notes.length > 200) state.notes.shift();
    const saved = safeSave();
    $('studioStatus').textContent = saved ? 'Saved to your browser notebook.' : 'Could not save in browser storage. Copy your reflection before leaving.';
    if (saved) { $('labReflection').value='';renderNotebook(); }
  }
  function exportNotes() {
    if (!state.notes.length) return;
    const data={app:'ORIGIN',version:'V7 Alpha 01',scope:'Local browser export',exportedAt:new Date().toISOString(),notes:state.notes};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download='origin-v7-discoveries.json';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view,true)));
  document.querySelectorAll('[data-lab]').forEach(b=>b.addEventListener('click',()=>{view('studio');studio(b.dataset.lab);}));
  document.querySelectorAll('[data-experience]').forEach(b=>b.addEventListener('click',()=>experience(b.dataset.experience)));
  ui.distance.addEventListener('input',renderStage);
  ui.light.addEventListener('input',renderStage);
  $('saveExperiment').addEventListener('click',saveLab);
  $('openLegacyStudio').addEventListener('click',()=>experience('legacy'));
  $('closeExperience').addEventListener('click',closeExperience);
  $('exportNotes').addEventListener('click',exportNotes);
  ui.story.addEventListener('load',watchStory);
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && !ui.dialogue.hidden) { event.preventDefault();closeExperience(); }
  });
  renderStage();
  renderNotebook();
})();
