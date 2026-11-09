const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../morpheme-bank.js','utf8'),ctx);
vm.runInNewContext(fs.readFileSync(__dirname+'/../data.js','utf8'),ctx);
const d=ctx.window.MM_DATA;
const bank=ctx.window.MM_MORPHEMES;
assert.equal(bank.schemaVersion,1);
assert.equal(d.prefixes.length,102);
assert.equal(d.roots.length,494);
assert.equal(d.suffixes.length,78);
assert.equal(d.real.length,471);
assert.equal(d.creative.length,129);
for (const [role,items] of [['prefix',d.prefixes],['base',d.roots],['suffix',d.suffixes]]) {
  assert.equal(new Set(items.map(x=>x.key)).size,items.length,'Duplicate '+role+' keys');
  for (const e of items) {
    assert.equal(e.role,role);
    assert.equal(e.key,role+':'+e.id);
    assert.ok(e.text&&e.meaning&&e.formClass,'Missing metadata for '+e.key);
    assert.equal(typeof e.creativeEligible,'boolean');
    if(e.source==='expanded-draft' && role!=='base')assert.ok(e.exampleWord,'Example required for '+e.key);
  }
}

  // v1.7: certify that merging the five original general subject choices
  // preserves every course-specific clue, word-part target and creative prompt.
  const courseIds=["grade9math","grade9science","grade9geography","grade9english","grade10history"];
  const oldGeneralIds=["math","science","geography","history","english"];
  const finger=rows=>{
    let h=2166136261;
    for(const ch of JSON.stringify(rows))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;
    return h.toString(16).padStart(8,'0');
  };
  const expected={"courseReal":"2007724e","courseCreative":"1a2aef1f","generalReal":"e64c8042","generalCreative":"29a4b262","courseEligible":"a388cd78"};
  assert.equal(finger(d.real.filter(x=>courseIds.includes(x.subject))),expected.courseReal,'Course Word Wizard data changed');
  assert.equal(finger(d.creative.filter(x=>courseIds.includes(x.subject))),expected.courseCreative,'Course Meaning Madness data changed');
  assert.equal(finger(d.real.filter(x=>x.subject==='general').map(({originalSubject,...rest})=>({...rest,subject:originalSubject}))),expected.generalReal,'General real-word data changed');
  assert.equal(finger(d.creative.filter(x=>x.subject==='general').map(({originalSubject,...rest})=>({...rest,subject:originalSubject}))),expected.generalCreative,'General creative data changed');
  assert.equal(finger(courseIds.map(id=>d.roots.filter(r=>r.subjects.includes(id)).map(r=>r.id))),expected.courseEligible,'Course root access changed');
  assert.deepEqual(Object.keys(d.subjects).sort(),['general',...courseIds].sort(),'Visible subject choices changed');
  assert.deepEqual(Object.keys(d.sparks).sort(),Object.keys(d.subjects).sort(),'Laboratory prompts do not match menu');
  assert.equal(d.subjects.general,'General Vocabulary');
  const generalReal=d.real.filter(x=>x.subject==='general');
  const generalCreative=d.creative.filter(x=>x.subject==='general');
  const generalRoots=d.roots.filter(x=>x.subjects.includes('general'));
  assert.equal(generalReal.length,40);
  assert.equal(generalCreative.length,30);
  assert.equal(generalRoots.length,250);
  assert.equal(d.sparks.general.length,25);
  assert.equal(new Set(generalReal.map(x=>x.answer)).size,40);
  assert.equal(d.real.filter(x=>oldGeneralIds.includes(x.subject)).length,0);
  assert.equal(d.creative.filter(x=>oldGeneralIds.includes(x.subject)).length,0);
  for(const id of oldGeneralIds){
    assert.equal(generalReal.filter(x=>x.originalSubject===id).length,({math:8,science:8,geography:7,history:7,english:10})[id]);
    assert.equal(generalCreative.filter(x=>x.originalSubject===id).length,6);
  }
  for(const puzzle of generalReal){
    assert.ok(['prefix','base','suffix'].filter(t=>puzzle.parts[t]!==null).length>=2,'General word has fewer than 2 parts: '+puzzle.answer);
    assert.ok(generalRoots.some(r=>r.id===puzzle.parts.base),'General word root unavailable: '+puzzle.answer);
  }
  for(const puzzle of generalCreative)assert.ok(generalRoots.some(r=>r.id===puzzle.root),'General creative root unavailable: '+puzzle.root);
const groups={};
for(const r of d.roots)groups[r.subject]=(groups[r.subject]||0)+1;
assert.equal(groups.math,52);
assert.equal(groups.grade9math,51);
assert.equal(groups.science,53);
assert.equal(groups.grade9science,50);
assert.equal(groups.geography,48);
assert.equal(groups.grade9geography,39);
assert.equal(groups.history,47);
assert.equal(groups.grade10history,50);
assert.equal(groups.english,50);
assert.equal(groups.grade9english,54);

assert.equal(d.subjects.grade9math,'Grade 9 Math');
const grade9Real=d.real.filter(q=>q.subject==='grade9math');
const grade9Creative=d.creative.filter(q=>q.subject==='grade9math');
assert.equal(grade9Real.length,70);
assert.equal(grade9Creative.length,15);
assert.equal(d.roots.filter(r=>r.subjects.includes('grade9math')).length,100);
for(const type of ['B','C','D','E','F']){
  assert.ok(grade9Real.some(q=>q.strand===type),'MTH1W strand missing in real: '+type);
  assert.ok(grade9Creative.some(q=>q.strand===type),'MTH1W strand missing in creative: '+type);
}
for(const puzzle of grade9Real){
  assert.ok(d.roots.some(r=>r.id===puzzle.parts.base&&r.subjects.includes('grade9math')),'Grade 9 real root missing: '+puzzle.answer);
}
for(const puzzle of grade9Creative){
  assert.ok(d.roots.some(r=>r.id===puzzle.root&&r.subjects.includes('grade9math')),'Grade 9 creative root missing: '+puzzle.root);
}
for(const puzzle of grade9Real){
  const componentIds=['prefix','base','suffix'].map(part=>puzzle.parts[part]).filter(Boolean);
  assert.ok(componentIds.length>=2,'MTH1W puzzle must use at least two meaningful parts: '+puzzle.answer);
}
assert.equal(new Set(grade9Real.map(p=>p.answer)).size,grade9Real.length,'Duplicate Grade 9 answer');
const newRequiredWords=["equality","fractional","divisible","divisor","noninteger","nonnegative","overestimate","underestimate","miscalculation","recalculation","algebraic","distributive","substitution","equivalent","rearrangement","bivariate","univariate","predictable","misleading","representation","misrepresentation","intersection","bisector","semicircle","diameter","equilateral","pentagon","hexagon","octagon","circumference","isometric","geometric","taxable","nontaxable","investment","reinvestment","repayment","prepayment","overpayment","overcharging"];
assert.equal(newRequiredWords.length,40);
for(const answer of newRequiredWords)assert.equal(grade9Real.filter(p=>p.answer===answer).length,1,'Missing or duplicated new word: '+answer);

assert.equal(d.subjects.grade9geography,'Grade 9 Geography');
const geographyReal=d.real.filter(x=>x.subject==='grade9geography');
const geographyCreative=d.creative.filter(x=>x.subject==='grade9geography');
assert.equal(geographyReal.length,76);
assert.equal(geographyCreative.length,20);
assert.equal(d.roots.filter(r=>r.subjects.includes('grade9geography')).length,93);
assert.equal(new Set(geographyReal.map(x=>x.answer)).size,76,'Duplicated Grade 9 Geography words');
for(const strand of ['A','B','C','D','E']){
  assert.ok(geographyReal.some(x=>x.strand===strand),'CGC1W strand missing in Word Wizard '+strand);
  assert.ok(geographyCreative.some(x=>x.strand===strand),'CGC1W strand missing in Meaning Madness '+strand);
}
for(const puzzle of geographyReal){
  assert.ok(['prefix','base','suffix'].filter(type=>puzzle.parts[type]!==null).length>=2,'Grade 9 Geography needs two genuine parts: '+puzzle.answer);
  assert.ok(d.roots.some(r=>r.id===puzzle.parts.base&&r.subjects.includes('grade9geography')),'Missing Grade 9 Geography base '+puzzle.answer);
}
for(const puzzle of geographyCreative){
  assert.ok(d.roots.some(r=>r.id===puzzle.root&&r.subjects.includes('grade9geography')),'Creative geography base '+puzzle.root);
}

assert.equal(d.subjects.grade9science,'Grade 9 Science');
const science9Real=d.real.filter(q=>q.subject==='grade9science');
const science9Creative=d.creative.filter(q=>q.subject==='grade9science');
assert.equal(science9Real.length,89);
assert.equal(science9Creative.length,20);
assert.equal(d.roots.filter(r=>r.subjects.includes('grade9science')).length,112);
assert.equal(new Set(science9Real.map(q=>q.answer)).size,science9Real.length,'Duplicate Grade 9 Science words');
for(const strand of ['A','B','C','D','E']){
  assert.ok(science9Real.some(q=>q.strand===strand),'Missing SNC1W real clue strand '+strand);
  assert.ok(science9Creative.some(q=>q.strand===strand),'Missing SNC1W creative clue strand '+strand);
}
for(const q of science9Real){
  assert.ok(['prefix','base','suffix'].filter(type=>q.parts[type]!==null).length>=2,'SNC1W requires at least 2 parts: '+q.answer);
  assert.ok(d.roots.some(r=>r.id===q.parts.base&&r.subjects.includes('grade9science')),'Science9 root missing: '+q.answer);
}
for(const q of science9Creative){
  assert.ok(d.roots.some(r=>r.id===q.root&&r.subjects.includes('grade9science')),'Science9 creative root missing '+q.root);
}

assert.equal(d.subjects.grade9english,'Grade 9 English');
const english9Real=d.real.filter(q=>q.subject==='grade9english');
const english9Creative=d.creative.filter(q=>q.subject==='grade9english');
assert.equal(english9Real.length,99);
assert.equal(english9Creative.length,24);
assert.equal(d.roots.filter(r=>r.subjects.includes('grade9english')).length,110);
assert.equal(new Set(english9Real.map(q=>q.answer)).size,english9Real.length,'Duplicate ENL1W words');
for(const strand of ['A','B','C','D']){
  assert.ok(english9Real.some(q=>q.strand===strand),'ENL1W missing real-word strand '+strand);
  assert.ok(english9Creative.some(q=>q.strand===strand),'ENL1W missing creative strand '+strand);
}
for(const q of english9Real){
  assert.ok(['prefix','base','suffix'].filter(type=>q.parts[type]!==null).length>=2,'ENL1W requires at least two parts: '+q.answer);
  assert.ok(d.roots.some(r=>r.id===q.parts.base&&r.subjects.includes('grade9english')),'ENL1W root missing '+q.answer);
}
for(const q of english9Creative){
  assert.ok(d.roots.some(r=>r.id===q.root&&r.subjects.includes('grade9english')),'ENL1W creative root missing '+q.root);
}

assert.equal(d.subjects.grade10history,'Grade 10 History');
const grade10Real=d.real.filter(x=>x.subject==='grade10history');
const grade10Creative=d.creative.filter(x=>x.subject==='grade10history');
assert.equal(grade10Real.length,97);
assert.equal(grade10Creative.length,20);
assert.equal(d.roots.filter(r=>r.subjects.includes('grade10history')).length,118);
assert.equal(new Set(grade10Real.map(x=>x.answer)).size,97);
for(const strand of ['A','B','C','D','E']){
  assert.ok(grade10Real.some(x=>x.strand===strand),'Missing CHC2 historical term in strand '+strand);
  assert.equal(grade10Creative.filter(x=>x.strand===strand).length,4,'Missing CHC2 creative prompts in strand '+strand);
}
for(const q of grade10Real){
  assert.ok(['prefix','base','suffix'].filter(type=>q.parts[type]!==null).length>=2,'CHC2 terms need 2+ meaningful parts: '+q.answer);
  assert.ok(d.roots.some(r=>r.id===q.parts.base&&r.subjects.includes('grade10history')),'Unavailable CHC2 root '+q.answer);
}
for(const q of grade10Creative){
  assert.ok(d.roots.some(r=>r.id===q.root&&r.subjects.includes('grade10history')),'Unavailable CHC2 creative root '+q.root);
}

// 2026-11-08 comprehensive Word Wizard audit. Every term requires a
// selectable base/root AND at least one other meaningful word part.
// The game must never regress to a single-root Word Wizard challenge.
const allReal=d.real;
const auditedThreePart=[["grade9math","percentage"],["grade9math","irrational"],["grade9math","overestimate"],["grade9math","underestimate"],["grade9math","nonlinear"],["grade9math","independent"],["grade9math","interquartile"],["grade9science","observation"],["grade9science","decomposer"],["grade9science","producer"],["grade9science","adaptation"],["grade9science","conductor"],["grade9science","conductivity"],["grade10history","constitution"]];
const auditKey=new Set(auditedThreePart.map(([subject,word])=>subject+'|'+word));
assert.equal(auditKey.size,14,'Editorial upgrade IDs must be unique');
let twoPartCount=0,threePartCount=0;
for(const word of allReal){
  const parts=word.parts;
  const nonEmpty=['prefix','base','suffix'].filter(role=>parts[role]!==null);
  assert.ok(parts.base,'Word Wizard must have a root: '+word.answer);
  assert.ok(parts.prefix!==null||parts.suffix!==null,'Word Wizard must have a prefix or suffix: '+word.answer);
  assert.ok(nonEmpty.length===2||nonEmpty.length===3,'Word Wizard must have 2–3 parts: '+word.answer);
  assert.ok(d.roots.some(root=>root.id===parts.base&&root.subjects.includes(word.subject)),'Root not available: '+word.answer);
  if(nonEmpty.length===2)twoPartCount++;else threePartCount++;
}
assert.equal(twoPartCount,275);
assert.equal(threePartCount,196);
for(const [subject,answer] of auditedThreePart){
  const matches=d.real.filter(word=>word.subject===subject&&word.answer===answer);
  assert.equal(matches.length,1,'Expected exactly one audited word: '+answer);
  assert.ok(['prefix','base','suffix'].every(part=>matches[0].parts[part]!==null),'Audited term must have three parts: '+answer);
}
// Fingerprint every unchanged challenge (not just course-specific totals).
// This protects 457 unchanged entries while allowing the 14 documented edits.
const untouched=d.real.filter(word=>!auditKey.has(word.subject+'|'+word.answer));
assert.equal(untouched.length,457);
assert.equal(finger(untouched),'8701e3de','An unreviewed Word Wizard challenge was modified');
assert.equal(finger(d.creative),'bd6b7b88','Meaning Madness prompts were altered');
const idx={prefix:new Map(d.prefixes.map(x=>[x.id,x])),base:new Map(d.roots.map(x=>[x.id,x])),suffix:new Map(d.suffixes.map(x=>[x.id,x]))};
console.log('Morpheme counts:', d.prefixes.length, d.roots.length, d.suffixes.length, 'Puzzles:',d.real.length, d.creative.length);
const errors=[];
for(const [type,arr] of Object.entries(idx))if(arr.size!==d[type==='base'?'roots':type+'es'].length) errors.push('Duplicate '+type);
for(const q of d.real){
  let result='';for(const type of ['prefix','base','suffix']){const id=q.parts[type];if(id!==null){if(!idx[type].has(id)) errors.push('Missing '+type+': '+id+' for '+q.answer);else result+=idx[type].get(id).text.replaceAll('-','');}}
  if(result!==q.answer)errors.push('Word mismatch '+q.answer+' vs '+result);
}
for(const q of d.creative){
  if(!idx.base.has(q.root))errors.push('Missing creative root '+q.root);
  if(!d.prefixes.some(p=>p.tags.includes(q.prefixTag)))errors.push('Missing prefix tag '+q.prefixTag);
  if(!d.suffixes.some(s=>s.tags.includes(q.suffixTag)))errors.push('Missing suffix tag '+q.suffixTag);
  if(!d.roots.some(r=>r.id===q.root&&(r.subject===q.subject||r.subjects.includes(q.subject))))errors.push('Bad category root '+q.root);
}
for(const subject of Object.keys(d.subjects)){
  for(const [key,questions] of [['real',d.real],['creative',d.creative]]){const n=questions.filter(q=>q.subject===subject).length;if(n<5)errors.push('Not enough '+key+' in '+subject+': '+n);}
}
console.log('Checks:',errors.length?errors:'OK');if(errors.length)process.exitCode=1;