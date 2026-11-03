/* Morphology Madness challenge library.
 * Morphemes are defined separately in morpheme-bank.js.
 */
'use strict';
(() => {
  const bank=window.MM_MORPHEMES;
  if(!bank)throw new Error('Load morpheme-bank.js before data.js');
  const {prefixes,roots,suffixes}=bank;
  const R = (subject, clue, prefix, base, suffix, answer, explanation) => ({subject, clue, parts:{prefix,base,suffix}, answer, explanation});
  const real = [
    R('math','A change in a figure’s position, size, or shape.','trans','form','ation','transformation','In mathematics, transformations include translations, rotations, reflections, and dilations.'),
    R('math','A point or set of points where objects meet.','inter','sect','ion','intersection','Two lines intersect where they share a point.'),
    R('math','The result or process of putting things in a different order.','re','arrange','ment','rearrangement','Rearranging can change the order of numbers or terms.'),
    R('math','The act of making groups again.','re','group','ing','regrouping','Regrouping can help with place-value calculations.'),
    R('math','The mathematical operation of taking one quantity away from another.','sub','tract','ion','subtraction','Subtraction finds a difference.'),
    R('math','A line or ray that divides an angle into two equal angles.','bi','sect','or','bisector','An angle bisector divides one angle into two congruent angles.'),
    R('math','Half of a circle.','semi','circle',null,'semicircle','A semicircle is a half-circle region; the word can also describe the curved arc.'),
    R('math','Not equal in value.','un','equal',null,'unequal','Unequal quantities do not have the same value.'),
    R('science','Able to be broken down through biological processes.','bio','degrad','able','biodegradable','Microorganisms can break down biodegradable material under suitable conditions.'),
    R('science','Describing a process that absorbs heat from its surroundings.','endo','therm','ic','endothermic','Endothermic processes take in heat.'),
    R('science','Describing a process that releases heat to its surroundings.','exo','therm','ic','exothermic','Exothermic processes give off heat.'),
    R('science','An instrument used to view very small objects.','micro','scope',null,'microscope','A microscope makes small objects easier to see.'),
    R('science','A living thing too small to see clearly without magnification.','micro','organism',null,'microorganism','Many microorganisms require magnification to observe.'),
    R('science','Describing a material that tends to repel water.','hydro','phob','ic','hydrophobic','Hydrophobic surfaces resist wetting by water.'),
    R('science','A scientist who studies living things.','bio','log','ist','biologist','Biologists study living organisms and life processes.'),
    R('science','An instrument for measuring temperature.',null,'thermo','meter','thermometer','Thermometers measure temperature.'),
    R('geography','Relating to Earth’s places and spatial patterns.','geo','graph','ic','geographic','Geographic descriptions address places and spatial relationships.'),
    R('geography','Stretching across a continent.','trans','continent','al','transcontinental','A transcontinental railway crosses a continent.'),
    R('geography','Involving more than one country.','inter','nation','al','international','International agreements involve multiple countries.'),
    R('geography','One half of a sphere.','hemi','sphere',null,'hemisphere','Earth is often divided into Northern and Southern Hemispheres.'),
    R('geography','The local climate of a very small area.','micro','climate',null,'microclimate','A garden or forest clearing may have its own microclimate.'),
    R('geography','Relating to the area outside a city centre.','sub','urban',null,'suburban','Suburban communities are generally found around urban centres.'),
    R('geography','Related to several different cultures.','multi','cultur','al','multicultural','Multicultural communities include many cultural groups.'),
    R('history','Relating to a time before written records in a region.','pre','histor','ic','prehistoric','The prehistoric period varies by location because writing emerged at different times.'),
    R('history','The process of building something again after destruction.','re','construct','ion','reconstruction','Reconstruction also names specific historical rebuilding periods.'),
    R('history','Relating to the era after colonial rule and its continuing effects.','post','colon','ial','postcolonial','Postcolonial can describe political periods and ways of examining colonial legacies.'),
    R('history','The period between major wars.','inter','war',null,'interwar','Interwar commonly refers to the years between the First and Second World Wars.'),
    R('history','Occurring before a war.','pre','war',null,'prewar','Prewar describes events before a particular conflict.'),
    R('history','A person opposed to imperial rule or expansion.','anti','imperial','ist','antiimperialist','Anti-imperialists oppose imperial rule or expansion.'),
    R('history','To remove colonial control from a place.','de','colon','ize','decolonize','Decolonization refers to processes of ending colonial control and addressing colonial structures.'),
    R('english','Not able to be predicted reliably.','un','predict','able','unpredictable','An unpredictable outcome is difficult to forecast.'),
    R('english','A difference of opinion.','dis','agree','ment','disagreement','Disagreement names a state or result of not agreeing.'),
    R('english','An incorrect understanding of meaning.','mis','interpret','ation','misinterpretation','A misinterpretation occurs when a message is understood incorrectly.'),
    R('english','To write something again.','re','write',null,'rewrite','A writer may rewrite a sentence to improve clarity.'),
    R('english','To look at something ahead of time.','pre','view',null,'preview','A preview provides an advance look.'),
    R('english','Not giving assistance or useful support.','un','help','ful','unhelpful','Unhelpful advice does not provide useful assistance.'),
    R('english','Without concern or attention. ',null,'care','less','careless','Careless behaviour shows too little care or attention.'),
    R('english','To read a text again.','re','read',null,'reread','Rereading can help readers understand complex passages.'),
    R('english','A statement that exaggerates something.','over','state','ment','overstatement','An overstatement presents something as greater than it is.'),
    R('english','Writing based on facts rather than an invented story.','non','fiction',null,'nonfiction','Nonfiction aims to present factual information or accounts.')
  ];
  const C = (subject, clue, prefixTag, root, suffixTag) => ({subject, clue, prefixTag, root, suffixTag});
  const creative = [
    C('math','A person who is wildly enthusiastic about fractions.','excess','fraction','person'),
    C('math','The study of impossibly tiny triangles.','small','triangle','study'),
    C('math','A person who is strongly opposed to equations.','against','equation','person'),
    C('math','Relating to a dazzling number of graphs.','many','graph','related'),
    C('math','A device invented to measure miniature angles.','small','angle','measurer'),
    C('math','A person who adores symmetry to an extreme degree.','excess','symmetry','lover'),
    C('science','An organism with an excessive love of algae.','excess','alga','lover'),
    C('science','A person who studies very tiny volcanoes.','small','volcano','student'),
    C('science','A person determined to protest against clouds.','against','cloud','person'),
    C('science','Relating to an extraordinary number of atoms.','many','atom','related'),
    C('science','A device invented to measure microscopic crystals.','small','crystal','measurer'),
    C('science','The study of unbelievably tiny planets.','small','planet','study'),
    C('geography','The study of microscopic mountains.','small','mountain','study'),
    C('geography','A person who campaigns against maps.','against','map','person'),
    C('geography','Relating to a place with an enormous number of rivers.','many','river','related'),
    C('geography','Someone with an excessive love of glaciers.','excess','glacier','lover'),
    C('geography','A device used to measure very tiny islands.','small','island','measurer'),
    C('geography','A person who studies miniature deserts.','small','desert','student'),
    C('history','Someone with an extreme fondness for castles.','excess','castle','lover'),
    C('history','The study of the period before empires emerge.','before','empire','study'),
    C('history','A fictional belief system opposing kings.','against','king','practice'),
    C('history','A supporter of a brand-new dynasty.','new','dynasty','person'),
    C('history','Relating to many different historical eras.','many','era','related'),
    C('history','A person who studies the periods after wars.','after','war','student'),
    C('english','The study of impossibly tiny poems.','small','poem','study'),
    C('english','A person who uses adjectives to an excessive degree.','excess','adjective','person'),
    C('english','Someone who campaigns against commas.','against','comma','person'),
    C('english','Relating to an overwhelming number of metaphors.','many','metaphor','related'),
    C('english','Someone with an extreme love for poetic verse.','excess','verse','lover'),
    C('english','A new set of invented grammar conventions.','new','grammar','practice')
  ];
  const sparks = {
    math:['Give a mathematical idea a surprising new identity.','What could a mysterious numerical creature be called?','Invent something a geometry teacher might never have encountered.','Create a term for an imaginary pattern or operation.','Try a mathematically themed invention that sounds almost believable.'],
    science:['Invent a fictional scientific instrument or creature.','Name an imaginary biological phenomenon.','Create the name of a process from an alternate universe.','Think of an improbable scientific discovery.','Invent something a scientist might find under a microscope.'],
    geography:['Invent a new kind of landscape or map feature.','Name a fictional phenomenon in the atmosphere.','Create a term for a peculiar geographic region.','Imagine explorers naming a remarkable new feature.','What could an unusual environmental phenomenon be called?'],
    history:['Invent a term for an imaginary historical movement.','Name a fictional institution or social practice.','Describe a peculiar event from an invented civilization.','Create a label for an imaginary historical era.','What might historians call an unusual new discovery?'],
    english:['Invent a term for a strange literary habit.','Describe an imaginary grammatical phenomenon.','Give a new poetic technique a name.','Invent a term for an unusual style of storytelling.','Create a word for a very specific reading experience.']
  };
  const subjects = {math:'Mathematics',science:'Science',geography:'Geography',history:'History',english:'English'};
  window.MM_DATA = {subjects,prefixes,roots,suffixes,real,creative,sparks};
})();