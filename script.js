/* Morphology Madness v0.1: small, curated, no-dependencies prototype.
   A puzzle is a precisely segmented answer, not a generative word validator.
   The meanings are simplified classroom prompts and should be reviewed before use. */
'use strict';
const puzzles = [
  {subject:'math',clue:'A change in the position, shape or size of a figure.',parts:[['trans','across or change'],['form','shape'],['-ation','act or process']],answer:'transformation',explanation:'A transformation changes a figure. In mathematics, examples include translations, rotations, reflections and dilations.'},
  {subject:'math',clue:'A place or point where mathematical objects cross or meet.',parts:[['inter-','between or among'],['sect','cut'],['-ion','act or result']],answer:'intersection',explanation:'An intersection is where lines, curves or sets share a point or element.'},
  {subject:'math',clue:'The act of putting terms or objects in a different order.',parts:[['re-','again or differently'],['arrange','put in order'],['-ment','result or process']],answer:'rearrangement',explanation:'Rearrangement changes the order of items, and can be useful when working with expressions or data.'},
  {subject:'science',clue:'A substance that can be broken down through natural biological processes.',parts:[['bio-','life'],['degrad','break down'],['-able','capable of']],answer:'biodegradable',explanation:'Biodegradable materials can be broken down by biological processes, often involving microorganisms. Conditions matter.'},
  {subject:'science',clue:'Describing a process that takes heat in from its surroundings.',parts:[['endo-','within or inward'],['therm','heat'],['-ic','relating to']],answer:'endothermic',explanation:'An endothermic process absorbs heat from its surroundings.'},
  {subject:'science',clue:'Describing something so small that a microscope may be needed to see it.',parts:[['micro-','small'],['scop','look or see'],['-ic','relating to']],answer:'microscopic',explanation:'Microscopic describes an object or feature too small to see clearly with the unaided eye.'},
  {subject:'geography',clue:'Relating to the Earth’s places, features and how they are represented.',parts:[['geo-','Earth'],['graph','write or describe'],['-ic','relating to']],answer:'geographic',explanation:'Geographic refers to the Earth’s places, environments and spatial patterns.'},
  {subject:'geography',clue:'Extending across a continent.',parts:[['trans-','across'],['continent','a major landmass'],['-al','relating to']],answer:'transcontinental',explanation:'A transcontinental route or connection reaches across a continent.'},
  {subject:'geography',clue:'Involving relationships between countries.',parts:[['inter-','between'],['nation','country or people'],['-al','relating to']],answer:'international',explanation:'International interactions involve more than one country.'},
  {subject:'history',clue:'Relating to the time before written historical records.',parts:[['pre-','before'],['histor','history'],['-ic','relating to']],answer:'prehistoric',explanation:'Prehistoric is commonly used for periods before written records in a particular region.'},
  {subject:'history',clue:'The process of rebuilding after destruction or major disruption.',parts:[['re-','again'],['construct','build'],['-ion','act or process']],answer:'reconstruction',explanation:'Reconstruction is the act of rebuilding. The term can also refer to specific historical periods.'},
  {subject:'history',clue:'Relating to the period after colonial rule.',parts:[['post-','after'],['colon','colonial rule'],['-ial','relating to']],answer:'postcolonial',explanation:'Postcolonial can refer to periods after colonial rule, as well as ongoing cultural and political effects of colonialism.'},
  {subject:'english',clue:'Not able to be anticipated or known ahead of time.',parts:[['un-','not'],['predict','tell in advance'],['-able','capable of']],answer:'unpredictable',explanation:'If something is unpredictable, it cannot be reliably predicted.'},
  {subject:'english',clue:'The state of having different opinions.',parts:[['dis-','opposite or apart'],['agree','share an opinion'],['-ment','state or result']],answer:'disagreement',explanation:'A disagreement is a difference in opinion.'},
  {subject:'english',clue:'The act of giving an incorrect meaning to something.',parts:[['mis-','wrongly'],['interpret','explain the meaning'],['-ation','act or process']],answer:'misinterpretation',explanation:'A misinterpretation occurs when someone understands a statement or event incorrectly.'}
];
const labels={math:'Mathematics',science:'Science',geography:'Geography',history:'History',english:'English'};
const $=id=>document.getElementById(id);
const subject=$('subject'), bank=$('card-bank'), clue=$('clue'), feedback=$('feedback'), progress=$('progress'), progressFill=$('progress-fill'), slots=[...document.querySelectorAll('.slot')];
let deck=[],index=0,solved=0,placed={prefix:null,base:null,suffix:null},cards=[],locked=false,hintLevel=0;
function shuffle(values){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function buildDeck(){const pool=puzzles.filter(p=>subject.value==='all'||p.subject===subject.value);return shuffle(pool).slice(0,5);}
function makeCard(type,part,meaning,id){return {type,part,meaning,id};}
function setupCards(p){
  const types=['prefix','base','suffix'];const answers=types.map((t,i)=>makeCard(t,p.parts[i][0],p.parts[i][1],`answer-${t}`));
  const distractors=[];
  for(const [i,t] of types.entries()){
    const candidates=shuffle(puzzles.filter(q=>q!==p).map(q=>q.parts[i]).filter(([text])=>text!==p.parts[i][0]));
    const seen=new Set();for(const [text,meaning] of candidates){if(!seen.has(text)){distractors.push(makeCard(t,text,meaning,`decoy-${t}`));seen.add(text);break;}}
  }
  return shuffle([...answers,...distractors]);
}
function formatPart(p){return p||'';}
function wordText(){const parts=['prefix','base','suffix'].map(t=>placed[t]?.part||'').map(v=>v.replaceAll('-',''));return parts.join('');}
function render(){
  slots.forEach(el=>{const type=el.dataset.slot;const item=placed[type];el.classList.toggle('filled',!!item);el.querySelector('.slot-content').textContent=item?item.part:'Choose card';el.setAttribute('aria-label',`${type==='base'?'Base or root':type} slot, ${item?item.part+', select to remove':'empty'}`);el.disabled=locked||!item;});
  const word=wordText();$('word-preview').textContent=word||'Your word appears here';$('word-preview').classList.toggle('placeholder',!word);
  bank.replaceChildren();for(const item of cards){const selected=Object.values(placed).some(p=>p?.id===item.id);const b=document.createElement('button');b.type='button';b.className='part-card';b.dataset.type=item.type;b.disabled=locked||selected;b.setAttribute('aria-label',`${item.type}: ${item.part}, meaning ${item.meaning}${selected?', selected':''}`);
    const type=document.createElement('span');type.className='card-type';type.textContent=item.type==='base'?'BASE / ROOT':item.type.toUpperCase();
    const part=document.createElement('span');part.className='card-text';part.textContent=item.part;
    const meaning=document.createElement('span');meaning.className='card-meaning';meaning.textContent=item.meaning;b.append(type,part,meaning);b.addEventListener('click',()=>selectCard(item));bank.append(b);}
  $('clear').disabled=locked||!Object.values(placed).some(Boolean);$('check').disabled=locked;$('hint').disabled=locked;$('skip').disabled=locked;
}
function announce(text){$('live').textContent='';requestAnimationFrame(()=>$('live').textContent=text);}
function selectCard(item){if(locked)return;placed[item.type]=item;hideFeedback();render();announce(`${item.part} added to ${item.type} slot. Word: ${wordText()}`);}
function removeCard(type){if(locked)return;if(!placed[type])return;placed[type]=null;hideFeedback();render();announce(`${type} card removed.`);}
function hideFeedback(){feedback.hidden=true;feedback.className='feedback';feedback.replaceChildren();}
function showFeedback(heading,message,status,buttonLabel,callback){feedback.hidden=false;feedback.className=`feedback ${status}`;const h=document.createElement('h3');h.textContent=heading;const p=document.createElement('p');p.textContent=message;feedback.replaceChildren(h,p);if(buttonLabel){const b=document.createElement('button');b.type='button';b.className='primary-btn';b.textContent=buttonLabel;b.addEventListener('click',callback);feedback.append(b);}announce(`${heading} ${message}`);}
function current(){return deck[index];}
function loadRound(){if(index>=deck.length){finish();return;}const p=current();placed={prefix:null,base:null,suffix:null};locked=false;hintLevel=0;cards=setupCards(p);$('category-chip').textContent=labels[p.subject].toUpperCase();clue.textContent=p.clue;$('round').textContent=`${index+1} / ${deck.length}`;$('parts-count').textContent='3 meaningful pieces';$('solved').textContent=solved;progress.setAttribute('aria-valuenow',String(index));progressFill.style.width=`${index/deck.length*100}%`;hideFeedback();render();}
function check(){if(locked)return;const p=current();if(!Object.values(placed).every(Boolean)){showFeedback('Not quite finished','Fill all three spaces, then check your word.','try-again');return;}
  const correct=['prefix','base','suffix'].every((t,i)=>placed[t].part===p.parts[i][0]);if(correct){solved++;locked=true;$('solved').textContent=solved;render();showFeedback('You built it! 🎉',`${p.answer}: ${p.explanation}`,'success',index===deck.length-1?'See my results':'Next word →',next);}else{showFeedback('Good experiment. Try another combination.','Look closely at the meaning of each card and compare it with the clue.','try-again');}}
function hint(){if(locked)return;const types=['prefix','base','suffix'];const p=current();const unmatched=types.filter((t,i)=>placed[t]?.part!==p.parts[i][0]);if(!unmatched.length){showFeedback('You have the pieces!','Press “Check my word” to test your construction.','try-again');return;}
  const t=unmatched[hintLevel % unmatched.length];const idx=types.indexOf(t);hintLevel++;showFeedback('A little nudge',`For the ${t==='base'?'base/root':t}, look for the card that means “${p.parts[idx][1]}.”`,'try-again');}
function next(){index++;loadRound();if(index<deck.length)clue.focus?.();}
function skip(){if(locked)return;locked=true;render();showFeedback('Word revealed',`The word was ${current().answer}. ${current().explanation}`,'try-again',index===deck.length-1?'See my results':'Next word →',next);}
function finish(){progress.setAttribute('aria-valuenow',String(deck.length));progressFill.style.width='100%';$('round').textContent=`${deck.length} / ${deck.length}`;$('category-chip').textContent='ROUND COMPLETE';$('parts-count').textContent='';$('challenge-title').textContent='Great word work!';clue.textContent=`You built ${solved} of ${deck.length} words. Explore how the pieces change meaning, then try another set.`;cards=[];bank.replaceChildren();placed={prefix:null,base:null,suffix:null};locked=true;render();hideFeedback();showFeedback('Ready for another round?', 'Choose a different subject, or replay for a new set of challenges.','success','Play again ↻',restart);$('skip').disabled=true;}
function restart(){$('challenge-title').textContent='Build a word that means…';deck=buildDeck();progress.setAttribute('aria-valuemax',String(deck.length));index=0;solved=0;loadRound();}
slots.forEach(el=>el.addEventListener('click',()=>removeCard(el.dataset.slot)));
$('clear').addEventListener('click',()=>{placed={prefix:null,base:null,suffix:null};hideFeedback();render();announce('All cards removed.');});
$('check').addEventListener('click',check);$('hint').addEventListener('click',hint);$('skip').addEventListener('click',skip);subject.addEventListener('change',restart);
restart();