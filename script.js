/* Morphology Madness v1.0. Client-side only; no network or student data storage.
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
    lab:{name:'WORD LABORATORY',title:'Spin the wheels to invent a word!',note:'The teacher spins three wheels. When they stop, write a definition that fits their meanings. There is no single correct answer.',action:'Review my definition',hint:'',score:'INVENTED'}
  };
  const LEVELS={apprentice:3,inventor:6,master:10};
  let selectedMode='wizard';
  let state=null;
  let reelTimers=[];
  let reelGeneration=0;
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
    const numberOfChoices=LEVELS[state.level];
    const cards={prefix:[],base:[],suffix:[]};
    for(const type of TYPES){
      const pool=candidates(type,puzzle.subject);
      if(state.mode==='wizard'){
        // Include the correct part when one is required. For optional slots,
        // show a full bank of distractors and let the learner leave the slot empty.
        const correct=item(type,puzzle.parts[type]);
        const distractors=take(pool.filter(c=>c.id!==correct?.id),numberOfChoices-(correct?1:0));
        cards[type]=shuffle(unique([correct,...distractors]));
      }else if(state.mode==='madness'){
        if(type==='base'){
          const correct=item('base',puzzle.root);
          cards[type]=shuffle(unique([correct,...take(pool.filter(c=>c.id!==correct.id),numberOfChoices-1)]));
        }else{
          const tag=type==='prefix'?puzzle.prefixTag:puzzle.suffixTag;
          const valid=take(pool.filter(c=>c.tags.includes(tag)),state.level==='apprentice'?1:2);
          const distractors=take(pool.filter(c=>!c.tags.includes(tag)),numberOfChoices-valid.length);
          cards[type]=shuffle(unique([...valid,...distractors]));
        }
      }else{
        throw new Error('Card selection is only used for Word Wizard and Meaning Madness.');
      }
      if(cards[type].length!==numberOfChoices){
        throw new Error('Not enough unique '+type+' cards for '+state.level+' ('+cards[type].length+'/'+numberOfChoices+').');
      }
    }
    return cards;
  };

  // Word Laboratory is a three-reel generator, not a manual card picker.
  // Apprentice uses the original, more familiar bank; Inventor introduces
  // about half the new entries; Master uses the full approved bank.
  const wheelPool=(type,subject)=>{
    const pool=candidates(type,subject);
    const familiar=pool.filter(part=>part.source==='original-bank');
    if(state.level==='apprentice')return familiar.length?familiar:pool;
    if(state.level==='inventor')return [
      ...familiar,
      ...pool.filter(part=>part.source!=='original-bank').filter((_,index)=>index%2===0)
    ];
    return pool;
  };
  const clearReelTimers=()=>{
    reelGeneration++;
    for(const timer of reelTimers){
      if(timer.kind==='interval')clearInterval(timer.id);
      else clearTimeout(timer.id);
    }
    reelTimers=[];
  };
  const resetLabMachine=()=>{
    state.labSpinning=false;state.labReady=false;
    $('spin').disabled=false;
    $('spin').textContent='✦ Spin the word wheels';
    $('spin-status').textContent='Ready when you are.';
    $('lab-reveal').hidden=true;
    $('definition-word').textContent='your surprise word';
    $('lab-word').textContent='';
    for(const type of TYPES){
      const reel=document.querySelector('[data-reel="'+type+'"]');
      reel.classList.remove('is-spinning','has-stopped');
      $('reel-'+type).textContent='?';
      $('reel-meaning-'+type).textContent='Waiting for the spin';
    }
  };
  const spinLab=()=>{
    if(!state||state.mode!=='lab'||state.locked||state.labSpinning)return;
    if($('definition').value.trim()&&!window.confirm('Spin again? This will erase the definition you are writing.'))return;
    clearReelTimers();
    const generation=reelGeneration;
    state.labSpinning=true;state.labReady=false;
    state.placed={prefix:null,base:null,suffix:null};
    $('definition').value='';
    $('review-one').checked=false;$('review-two').checked=false;
    hideAdvice();
    $('lab-reveal').hidden=true;$('definition-area').hidden=true;$('action-row').hidden=true;
    $('spin').disabled=true;$('spin').textContent='Wheels spinning…';
    $('spin-status').textContent='All three wheels are spinning…';
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const delays=reduced?[70,140,210]:[1050,1750,2450];
    let stopped=0;
    TYPES.forEach((type,index)=>{
      const pool=wheelPool(type,current().subject);
      if(!pool.length)throw new Error('No eligible word parts for '+type);
      const target=pool[Math.floor(Math.random()*pool.length)];
      const reel=document.querySelector('[data-reel="'+type+'"]');
      const display=$('reel-'+type);
      reel.classList.remove('has-stopped');
      reel.classList.add('is-spinning');
      $('reel-meaning-'+type).textContent='Spinning…';
      let ticker=null;
      if(!reduced){
        ticker=setInterval(()=>{
          if(generation!==reelGeneration)return;
          display.textContent=pool[Math.floor(Math.random()*pool.length)].text;
        },75+index*19);
        reelTimers.push({kind:'interval',id:ticker});
      } else {
        display.textContent='…';
      }
      const timeout=setTimeout(()=>{
        if(generation!==reelGeneration||!state||state.mode!=='lab')return;
        if(ticker!==null)clearInterval(ticker);
        state.placed[type]=target;
        display.textContent=target.text;
        $('reel-meaning-'+type).textContent=target.meaning;
        reel.classList.remove('is-spinning');reel.classList.add('has-stopped');
        stopped++;
        const labels={prefix:'Prefix',base:'Root',suffix:'Ending'};
        $('spin-status').textContent=labels[type]+' stopped'+(stopped===3?'.':'…');
        if(stopped===3){
          state.labSpinning=false;state.labReady=true;
          const word=assembled();
          $('lab-word').textContent=word;
          $('definition-word').textContent=word;
          $('lab-reveal').hidden=false;
          $('definition-area').hidden=false;$('action-row').hidden=false;
          $('spin').disabled=false;$('spin').textContent='↻ Spin again (clear draft)';
          $('spin-status').textContent='All three wheels stopped. Now write your definition.';
          announce('The new word is '+word+'. Now write your own definition.');
          $('definition').focus({preventScroll:true});
          $('definition-area').scrollIntoView({block:'nearest'});
        }
      },delays[index]);
      reelTimers.push({kind:'timeout',id:timeout});
    });
  };
  const renderCards=()=>{
    const bank=$('card-bank');bank.replaceChildren();
    const headings={prefix:'Prefixes',base:'Bases and roots',suffix:'Endings'};
    for(const type of TYPES){
      const column=document.createElement('section');column.className='bank-column';column.dataset.type=type;
      const h=document.createElement('h4');h.textContent=headings[type]+' · '+state.cards[type].length;
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
    if(state.mode==='lab')$('spin').disabled=state.locked||!!state.labSpinning;
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
    clearReelTimers();
    state.placed={prefix:null,base:null,suffix:null};
    state.cards=state.mode==='lab'?{prefix:[],base:[],suffix:[]}:createCards(puzzle);
    state.locked=false;state.hints=0;state.attempts=0;
    $('category-chip').textContent=data.subjects[puzzle.subject].toUpperCase();
    $('parts-count').textContent=state.mode==='lab'
      ?`${state.level[0].toUpperCase()+state.level.slice(1)} · Round ${state.index+1}`
      :`${state.level[0].toUpperCase()+state.level.slice(1)} · ${LEVELS[state.level]} cards per group`;
    $('challenge-title').textContent=mode().title;
    $('clue').textContent=state.mode==='lab'?'A random word is coming. What could it mean?':puzzle.clue.trim();$('mode-note').textContent=mode().note;
    $('check').textContent=mode().action+' →';$('hint').textContent=mode().hint;
    const isLab=state.mode==='lab';
    $('lab-machine').hidden=!isLab;
    $('workbench').hidden=isLab;
    $('cards-heading').hidden=isLab;
    $('card-bank').hidden=isLab;
    $('hint').hidden=isLab;
    $('definition-area').hidden=true;
    $('action-row').hidden=isLab;
    $('definition').value='';
    if(isLab)resetLabMachine();
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
    if(!state.labReady||state.labSpinning){setFeedback('Spin first','Spin the three word-part wheels before defining your word.');return;}
    if(!state.placed.base||filledCount()<2){setFeedback('Give your word another piece','Spin again to build a complete word.');return;}
    const definition=$('definition').value.trim();
    if(definition.length<18){setFeedback('Tell us what it means','Write a definition of at least 18 characters before reviewing it.');$('definition').focus();return;}
    setFeedback('Ready for your self-check?','Read your definition alongside the card meanings. You decide whether you have explained a plausible invention.');
    $('review-meanings').textContent='You chose: '+explainParts()+'.';
    $('self-review').hidden=false;
  };
  const finishLab=()=>{
    if(state.locked||state.mode!=='lab'||!state.labReady||state.labSpinning)return;
    if(!$('review-one').checked||!$('review-two').checked){setFeedback('Complete both reflections','Check both statements if you can justify your invented word. Otherwise, revise your word or definition.');return;}
    const definition=$('definition').value.trim();
    if(!state.placed.base||filledCount()<2||definition.length<18){setFeedback('Review your word again','Your word or definition has changed. Check it again before finishing.');$('self-review').hidden=true;return;}
    markComplete({word:assembled(),definition,note:'Self-reviewed invention'},'selfReview');
    $('self-review').hidden=true;
  };
  const hint=()=>{
    if(state.locked)return;
    if(state.mode==='lab')return;
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
    state.locked=true;
    if(state.mode==='lab')clearReelTimers();
    progress();render();
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
    clearReelTimers();
    state={mode:selectedMode,subject:$('subject').value,level:$('level').value,deck:[],index:0,completed:0,tagMatched:0,selfReviewed:0,completedWords:[],placed:{prefix:null,base:null,suffix:null},cards:{},locked:false,hints:0,attempts:0};
    state.deck=buildDeck();
    if(!state.deck.length){$('setup').hidden=false;alert('No challenges are available for this selection.');return;}
    $('setup').hidden=true;$('game').hidden=false;$('play-area').hidden=false;$('results').hidden=true;
    $('mode-name').textContent=mode().name;$('score-label').textContent=mode().score;
    loadRound();$('game').scrollIntoView({block:'start',behavior:'instant'});
  };
  function showSetup(){
    clearReelTimers();
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
  const updateLevelDescriptions=()=>{
    const isLab=selectedMode==='lab';
    $('level-description').textContent=isLab
      ?'Subject chooses the root wheel; level controls the variety of parts on all three wheels.'
      :'Subject chooses the vocabulary; each level gives you 3, 6, or 10 cards in each word-part group.';
    const descriptions=isLab
      ?['Familiar word parts','Expanded word bank','Full word bank']
      :['3 cards per group','6 cards per group','10 cards per group'];
    for(const [i,option] of [...$('level').options].entries()){
      option.textContent=['Apprentice','Inventor','Master'][i]+' · '+descriptions[i];
    }
  };
  for(const card of document.querySelectorAll('.mode-card'))card.addEventListener('click',()=>{
    selectedMode=card.dataset.mode;
    updateLevelDescriptions();
    for(const option of document.querySelectorAll('.mode-card')){const selected=option.dataset.mode===selectedMode;option.classList.toggle('active',selected);option.setAttribute('aria-pressed',String(selected));}
  });
  for(const slot of document.querySelectorAll('.slot'))slot.addEventListener('click',()=>removeCard(slot.dataset.slot));
  $('start').addEventListener('click',startGame);
  $('spin').addEventListener('click',spinLab);
  $('back').addEventListener('click',requestExit);
  $('leave').addEventListener('click',requestExit);
  $('stay').addEventListener('click',()=>$('exit-dialog').close());
  $('confirm-exit').addEventListener('click',showSetup);
  $('check').addEventListener('click',check);$('hint').addEventListener('click',hint);$('skip').addEventListener('click',skip);
  $('clear').addEventListener('click',()=>{if(state.locked)return;state.placed={prefix:null,base:null,suffix:null};hideAdvice();render();announce('Cards cleared.');});
  $('defend').addEventListener('click',finishDefense);$('finish-invention').addEventListener('click',finishLab);
  $('definition').addEventListener('input',()=>{if(state?.mode==='lab'&&!state.locked){$('self-review').hidden=true;$('feedback').hidden=true;}});
  $('challenge-title').setAttribute('tabindex','-1');
  updateLevelDescriptions();
})();