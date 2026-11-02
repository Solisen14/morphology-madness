const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../data.js','utf8'),ctx);const d=ctx.window.MM_DATA;
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
  if(!d.roots.some(r=>r.id===q.root&&r.subject===q.subject))errors.push('Bad category root '+q.root);
}
for(const subject of Object.keys(d.subjects)){
  for(const [key,questions] of [['real',d.real],['creative',d.creative]]){const n=questions.filter(q=>q.subject===subject).length;if(n<5)errors.push('Not enough '+key+' in '+subject+': '+n);}
}
console.log('Checks:',errors.length?errors:'OK');if(errors.length)process.exitCode=1;