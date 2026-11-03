/* Morphology Madness v0.2.1. Client-side only; no network or student data storage.
 * Three modes share one bank. Creative meaning checks are deliberately limited:
 * a semantic tag match is a scaffold, not automated linguistic adjudication.
 */
'use strict';
(() => {
  const data = window.MM_DATA;
  if (!data) throw new Error('Morpheme data not loaded.');
  const $ = id => document.getElementById(id);
  const TYPES = ['prefix','base','suffix'];
  const BANKS = {prefix:data.prefixes,base:data.roots,suffix:data.suffixes};
  const INDEX = Object.fromEntries(TYPES.map(type => [type,new Map(BANKS[type].map(item=>[item.id,item]))]));
  const MODES = {
    wizard:{name:'WORD WIZARD',title:'Build a real word that means…',note:'One real word matches this definition. Some words use two parts, others use three.',action:'Check my word',hint:'Give me a hint',score:'SOLVED'},
    madness:{name:'MEANING MADNESS',title:'Invent a word that could mean…',note:'Make a believable nonsense word. More than one answer can fit; explain a creative alternative.',action:'Check the meaning',hint:'Give me a nudge',score:'CREATED'},
    lab:{name:'WORD LABORATORY',title:'An invention prompt for you…',note:'Pick a root plus at least one other piece. You write the definition; there is no single correct word.',action:'Review my definition',hint:'Deal new cards',score:'INVENTED'}
  };
  const LEVELS={apprentice:1,inventor:2,master:3};
  let selectedMode='wizard';
  let state=null;
  const shuffle=items=>{
    const a=[...items];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  };
  const take=(items,n)=>shuffle(items).slice(0,n);
  const unique=items=>[...new Map(items.filter(Boolean).map(item=>[item.id,item])).values()];
  const item=(type,id)=>id==null?null:INDEX[type].get(id);
  const assembled=()=>TYPES.map(type=>state.placed[type]?.text.replaceAll('-','')||'').join('');
  const filledCount=()=>TYPES.filter(type=>state.placed[type]).length;
  const current=()=>state.deck[state.index];
  const announce=message=>{$('live').textContent=message;};
  const mode=()=>MODES[state.mode];
  const subjects=Object.keys(data.subjects);
  const setFeedback=(title,message,tone='try-again',buttonLabel=null,action=null)=>{
    const box=$('feedback');box.replaceChildren();box.className='feedback '+tone;box.hidden=false;
    const h=document.createElement('h3');h.textContent=title;
    const p=document.createElement('p');p.textContent=message;
    box.append(h,p);
    if(buttonLabel&&action){const b=document.createElement('button');b.type='button';b.className='primary-btn';b.textContent=buttonLabel;b.addEventListener('click',action);box.append(b);}
    announce(`${title}. ${message}`);
  };
  const hideAdvice=()=>{$('feedback').hidden=true;$('defense').hidden=true;$('self-review').hidden=true;};
  const buildDeck=()=>{
    const categoryFilter=p=>state.subject==='all'||p.subject===state.subject;
    if(state.mode==='wizard')return take(data.real.filter(categoryFilter),5);
    if(state.mode==='madness')return take(data.creative.filter(categoryFilter),5);
    const subjectOrder=state.subject==='all'?take([...subjects,...subjects],5):Array(5).fill(state.subject);
    return subjectOrder.map((subject,i)=>({subject,clue:data.sparks[subject][i%data.sparks[subject].length]}));
  };
  const candidates=(type,subject)=>{
    const pool=type==='base'?data.roots.filter(r=>r.subject===subject):BANKS[type];
    // Preserve all authored Word Wizard answers; avoid standalone inflections
    // in invented-word card decks unless explicitly enabled later.
    return state.mode==='wizard'?pool:pool.filter(r=>r.creativeEligible!==false);
  };
  const createCards=(puzzle)=>{
    const multiplier=LEVELS[state.level];
    const cards={prefix:[],base:[],suffix:[]};
    for(const type of TYPES){
      const pool=candidates(type,puzzle.subject);
      if(state.mode==='wizard'){
        const correct=item(type,puzzle.parts[type]);
        const decoys=take(pool.filter(c=>c.id!==correct?.id),multiplier+(correct?0:1));
        cards[type]=shuffle(unique([correct,...decoys]));
      }else if(state.mode==='madness'){
        if(type==='base'){
          const correct=item('base',puzzle.root);
          cards[type]=shuffle(unique([correct,...take(pool.filter(c=>c.id!==correct.id),multiplier+2)]));
        }else{
          const target=type==='prefix'?puzzle.prefixTag:puzzle.suffixTag;
          const matched=pool.filter(c=>c.tags.includes(target));
          const valid=take(matched,Math.min(2,matched.length));
          const decoys=take(pool.filter(c=>!c.tags.includes(target)),multiplier+1);
          cards[type]=shuffle(unique([...valid,...decoys]));
        }
      }else{
        const count=type==='base'?multiplier*2+3:multiplier*2+2;
        cards[type]=take(pool,count);
      }
    }
    return cards;
  };
  const renderCards=()=>{
    const bank=$('card-bank');bank.replaceChildren();
    const headings={prefix:'Prefixes',base:'Bases and roots',suffix:'Endings'};
    for(const type of TYPES){
      const column=document.createElement('section');column.className='bank-column';column.dataset.type=type;
      const h=document.createElement('h4');h.textContent=headings[type];
      const group=document.createElement('div');group.className='bank-cards';
      for(const card of state.cards[type]){
        const button=document.createElement('button');button.type='button';button.className='part-card';
        const picked=state.placed[type]?.id===card.id;
        button.classList.toggle('selected',picked);button.disabled=state.locked||picked;
        button.setAttribute('aria-label',`${card.text}. ${card.meaning}${picked?', selected':''}`);
        const name=document.createElement('span');name.className='card-text';name.textContent=card.text;
        const description=document.createElement('span');description.className='card-meaning';description.textContent=card.meaning;
        button.append(name,description);button.addEventListener('click',()=>selectCard(type,card));group.append(button);
      }
      column.append(h,group);bank.append(column);
    }
  };
  const render=()=>{
    for(const slot of document.querySelectorAll('.slot')){
      const type=slot.dataset.slot, chosen=state.placed[type];
      slot.classList.toggle('filled',!!chosen);
      slot.querySelector('.slot-content').textContent=chosen?chosen.text:(type==='base'?'Choose a root':'Leave empty or choose');
      slot.disabled=state.locked||!chosen;
      slot.setAttribute('aria-label',chosen?`${type}, ${chosen.text}. Select to remove.`:`${type}, empty`);
    }
    const word=assembled();$('word-preview').textContent=word||'Your word appears here';$('word-preview').classList.toggle('placeholder',!word);
    $('clear').disabled=state.locked||filledCount()===0;
    $('check').disabled=state.locked;$('hint').disabled=state.locked;$('skip').disabled=state.locked;
    renderCards();
  };
  const selectCard=(type,card)=>{
    if(state.locked)return;
    state.placed[type]=card;hideAdvice();render();announce(`${card.text} added. Your word: ${assembled()}`);
  };
  const removeCard=type=>{
    if(state.locked||!state.placed[type])return;
    state.placed[type]=null;hideAdvice();render();announce(`${type} removed.`);
  };
  const progress=()=>{
    $('round').textContent=`${Math.min(state.index+1,state.deck.length)} / ${state.deck.length}`;
    $('solved').textContent=state.completed;
    $('progress').setAttribute('aria-valuemax',String(state.deck.length));
    const advanced=Math.min(state.index+(state.locked?1:0),state.deck.length);
    $('progress').setAttribute('aria-valuenow',String(advanced));
    $('progress-fill').style.width=`${advanced/state.deck.length*100}%`;
  };
  const loadRound=()=>{
    if(state.index>=state.deck.length){renderResults();return;}
    const puzzle=current();
    state.placed={prefix:null,base:null,suffix:null};state.cards=createCards(puzzle);state.locked=false;state.hints=0;state.attempts=0;
    $('category-chip').textContent=data.subjects[puzzle.subject].toUpperCase();
    $('parts-count').textContent=`${state.level[0].toUpperCase()+state.level.slice(1)} · Round ${state.index+1}`;
    $('challenge-title').textContent=mode().title;
    $('clue').textContent=puzzle.clue.trim();$('mode-note').textContent=mode().note;
    $('check').textContent=mode().action+' →';$('hint').textContent=mode().hint;
    $('definition-area').hidden=state.mode!=='lab';$('definition').value='';
    $('defense-text').value='';$('defense-check').checked=false;
    $('review-one').checked=false;$('review-two').checked=false;
    hideAdvice();progress();render();
  };
  const markComplete=(detail,flag)=>{
    state.completed++;state.locked=true;
    if(flag==='tagMatch')state.tagMatched++;
    if(flag==='selfReview')state.selfReviewed++;
    state.completedWords.push(detail);
    progress();render();
    const last=state.index===state.deck.length-1;
    setFeedback(flag==='tagMatch'?'Strong meaning match!':flag==='real'?'You built it!':'Invention recorded for this session',
      flag==='tagMatch'?'Your parts support the clue. This is an invented construction, not necessarily an existing dictionary word.':
      flag==='real'?current().explanation:'You explained or self-reviewed your invention. It has not been automatically judged correct.',
      'success',last?'See my results':'Next round →',nextRound);
  };
  const checkWizard=()=>{
    const puzzle=current();state.attempts++;
    if(!state.placed.base){setFeedback('Start with a root','Choose a base/root, then consider whether the word needs a prefix or suffix.');return;}
    const correct=TYPES.every(type=>(state.placed[type]?.id??null)===(puzzle.parts[type]??null));
    if(correct){markComplete({word:assembled(),definition:puzzle.clue,note:'Real vocabulary word'},'real');return;}
    setFeedback('Not this combination yet','Compare each card’s meaning with the clue. Some real words need only two parts, so leaving a slot empty may be correct.');
  };
  const explainParts=()=>TYPES.filter(type=>state.placed[type]).map(type=>`${state.placed[type].text} (${state.placed[type].meaning})`).join('; ');
  const checkMadness=()=>{
    const puzzle=current();state.attempts++;
    if(!state.placed.base||filledCount()<2){setFeedback('Build a little more','Use a root and at least one other meaningful card to create a word.');return;}
    const chosen=state.placed;
    const match=chosen.base.id===puzzle.root&&!!chosen.prefix?.tags.includes(puzzle.prefixTag)&&!!chosen.suffix?.tags.includes(puzzle.suffixTag);
    if(match){markComplete({word:assembled(),definition:puzzle.clue,note:'Word-part meanings match the clue'},'tagMatch');return;}
    setFeedback('Interesting invention','Your pieces suggest: '+explainParts()+'. You can change cards to fit the clue more closely, or write a reasoned alternative explanation.');
    $('defense').hidden=false;
  };
  const finishDefense=()=>{
    if(state.locked||state.mode!=='madness')return;
    const explanation=$('defense-text').value.trim();
    if(explanation.length<24||!$('defense-check').checked){setFeedback('Explain your reasoning','Write at least 24 characters about how the pieces fit, then check the reflection box.');return;}
    markComplete({word:assembled(),definition:explanation,note:'Self-reviewed alternative for: '+current().clue},'selfReview');
    $('defense').hidden=true;
  };
  const checkLab=()=>{
    if(!state.placed.base||filledCount()<2){setFeedback('Give your word another piece','Choose a base/root and at least one prefix or ending.');return;}
    const definition=$('definition').value.trim();
    if(definition.length<18){setFeedback('Tell us what it means','Write a definition of at least 18 characters before reviewing it.');$('definition').focus();return;}
    setFeedback('Ready for your self-check?','Read your definition alongside the card meanings. You decide whether you have explained a plausible invention.');
    $('review-meanings').textContent='You chose: '+explainParts()+'.';
    $('self-review').hidden=false;
  };
  const finishLab=()=>{
    if(state.locked||state.mode!=='lab')return;
    if(!$('review-one').checked||!$('review-two').checked){setFeedback('Complete both reflections','Check both statements if you can justify your invented word. Otherwise, revise your word or definition.');return;}
    const definition=$('definition').value.trim();
    if(!state.placed.base||filledCount()<2||definition.length<18){setFeedback('Review your word again','Your word or definition has changed. Check it again before finishing.');$('self-review').hidden=true;return;}
    markComplete({word:assembled(),definition,note:'Self-reviewed invention'},'selfReview');
    $('self-review').hidden=true;
  };
  const hint=()=>{
    if(state.locked)return;
    if(state.mode==='lab'){
      state.cards=createCards(current());state.placed={prefix:null,base:null,suffix:null};$('definition').value='';hideAdvice();render();announce('A new group of word cards was dealt.');return;
    }
    if(state.mode==='wizard'){
      const puzzle=current();const missing=TYPES.find(type=>(state.placed[type]?.id??null)!==(puzzle.parts[type]??null));
      if(!missing){setFeedback('Looks promising','Press Check my word to test your construction.');return;}
      const expected=item(missing,puzzle.parts[missing]);
      setFeedback('A helpful clue',expected?`Think about the ${missing==='base'?'base/root':missing}: look for a piece meaning “${expected.meaning}.”`:`This word does not require a ${missing==='base'?'base/root':missing}.`);return;
    }
    const p=current();const targetType=!state.placed.base?'base':!state.placed.prefix?'prefix':'suffix';
    const target=targetType==='base'?item('base',p.root):null;
    const label=targetType==='base'?`The root relates to “${target.meaning}.”`:targetType==='prefix'?`Look for a beginning that conveys “${p.prefixTag}.”`:`Look for an ending that conveys “${p.suffixTag}.”`;
    setFeedback('Try this idea',label);
  };
  const check=()=>{
    if(state.locked)return;
    if(state.mode==='wizard')checkWizard();
    else if(state.mode==='madness')checkMadness();
    else checkLab();
  };
  const nextRound=()=>{state.index++;loadRound();if(state.index<state.deck.length)$('challenge-title').focus();};
  const skip=()=>{
    if(state.locked)return;
    state.locked=true;progress();render();
    const puzzle=current();
    const message=state.mode==='wizard'?`One real answer was “${puzzle.answer}.” ${puzzle.explanation}`:
      state.mode==='madness'?'Many meaningful inventions are possible. Try another clue.':'No invention recorded for this round.';
    setFeedback('Round skipped',message,'try-again',state.index===state.deck.length-1?'See my results':'Next round →',nextRound);
  };
  const renderResults=()=>{
    $('play-area').hidden=true;$('results').hidden=false;
    $('progress').setAttribute('aria-valuenow',String(state.deck.length));$('progress-fill').style.width='100%';
    $('round').textContent=`${state.deck.length} / ${state.deck.length}`;
    const root=$('results');root.replaceChildren();
    const symbol=document.createElement('div');symbol.className='result-emoji';symbol.setAttribute('aria-hidden','true');symbol.textContent=state.mode==='wizard'?'★':'✦';
    const title=document.createElement('h2');title.textContent=state.mode==='wizard'?'Word Wizard complete!':'Your word workshop is complete!';
    const detail=document.createElement('p');detail.textContent=state.mode==='wizard'?`You solved ${state.completed} of ${state.deck.length} real-word challenges.`:
      state.mode==='madness'?`You created ${state.completed} words. ${state.tagMatched} matched the clue’s word-part functions; ${state.selfReviewed} were explained alternatives.`:
      `You finished ${state.completed} self-reviewed inventions. These were not automatically graded.`;
    root.append(symbol,title,detail);
    if(state.completedWords.length){const entries=document.createElement('div');entries.className='result-list';
      for(const record of state.completedWords){const article=document.createElement('div');article.className='result-entry';
        const word=document.createElement('strong');word.textContent=record.word;
        const def=document.createElement('p');def.textContent=record.definition;
        article.append(word,def);entries.append(article);}
      root.append(entries);
    }
    const actions=document.createElement('div');actions.className='result-actions';
    const again=document.createElement('button');again.className='primary-btn';again.type='button';again.textContent='Another five rounds ↻';again.addEventListener('click',()=>startGame());
    const menu=document.createElement('button');menu.className='secondary-btn';menu.type='button';menu.textContent='Choose another mode';menu.addEventListener('click',showSetup);
    actions.append(again,menu);root.append(actions);title.setAttribute('tabindex','-1');title.focus();
  };
  const startGame=()=>{
    state={mode:selectedMode,subject:$('subject').value,level:$('level').value,deck:[],index:0,completed:0,tagMatched:0,selfReviewed:0,completedWords:[],placed:{prefix:null,base:null,suffix:null},cards:{},locked:false,hints:0,attempts:0};
    state.deck=buildDeck();
    if(!state.deck.length){$('setup').hidden=false;alert('No challenges are available for this selection.');return;}
    $('setup').hidden=true;$('game').hidden=false;$('play-area').hidden=false;$('results').hidden=true;
    $('mode-name').textContent=mode().name;$('score-label').textContent=mode().score;
    loadRound();$('game').scrollIntoView({block:'start',behavior:'instant'});
  };
  function showSetup(){
    if($('exit-dialog').open)$('exit-dialog').close();
    state=null;$('game').hidden=true;$('setup').hidden=false;
    $('setup').scrollIntoView({block:'start',behavior:'instant'});
  }
  const requestExit=()=>{
    if(!state||!$('results').hidden){showSetup();return;}
    const dialog=$('exit-dialog');
    dialog.showModal();
    $('stay').focus();
  };
  for(const card of document.querySelectorAll('.mode-card'))card.addEventListener('click',()=>{
    selectedMode=card.dataset.mode;
    for(const option of document.querySelectorAll('.mode-card')){const selected=option.dataset.mode===selectedMode;option.classList.toggle('active',selected);option.setAttribute('aria-pressed',String(selected));}
  });
  for(const slot of document.querySelectorAll('.slot'))slot.addEventListener('click',()=>removeCard(slot.dataset.slot));
  $('start').addEventListener('click',startGame);
  $('back').addEventListener('click',requestExit);
  $('leave').addEventListener('click',requestExit);
  $('stay').addEventListener('click',()=>$('exit-dialog').close());
  $('confirm-exit').addEventListener('click',showSetup);
  $('check').addEventListener('click',check);$('hint').addEventListener('click',hint);$('skip').addEventListener('click',skip);
  $('clear').addEventListener('click',()=>{if(state.locked)return;state.placed={prefix:null,base:null,suffix:null};hideAdvice();render();announce('Cards cleared.');});
  $('defend').addEventListener('click',finishDefense);$('finish-invention').addEventListener('click',finishLab);
  $('definition').addEventListener('input',()=>{if(state?.mode==='lab'&&!state.locked){$('self-review').hidden=true;$('feedback').hidden=true;}});
  $('challenge-title').setAttribute('tabindex','-1');
})();