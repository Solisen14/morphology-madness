const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../morpheme-bank.js','utf8'),ctx);
vm.runInNewContext(fs.readFileSync(__dirname+'/../data.js','utf8'),ctx);
const d=ctx.window.MM_DATA;
const bank=ctx.window.MM_MORPHEMES;
assert.equal(bank.schemaVersion,1);
assert.equal(d.prefixes.length,72);
assert.equal(d.roots.length,284);
assert.equal(d.suffixes.length,61);
assert.equal(d.real.length,70);
assert.equal(d.creative.length,45);
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
const groups={};
for(const r of d.roots)groups[r.subject]=(groups[r.subject]||0)+1;
assert.equal(groups.math,52);
assert.equal(groups.grade9math,34);
assert.equal(groups.science,53);
assert.equal(groups.geography,48);
assert.equal(groups.history,47);
assert.equal(groups.english,50);

assert.equal(d.subjects.grade9math,'Grade 9 Math');
const grade9Real=d.real.filter(q=>q.subject==='grade9math');
const grade9Creative=d.creative.filter(q=>q.subject==='grade9math');
assert.equal(grade9Real.length,30);
assert.equal(grade9Creative.length,15);
assert.equal(d.roots.filter(r=>r.subjects.includes('grade9math')).length,82);
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