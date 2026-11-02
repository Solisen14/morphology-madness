/* Morphology Madness: one extensible morpheme bank shared by three modes.
 * Tags represent broad classroom semantic functions, not exact interchangeability.
 * All examples and prompt wording require editorial review before formal assessment.
 */
'use strict';
(() => {
  const p = (id, meaning, tags = []) => ({id, text: id + '-', meaning, tags});
  const s = (id, meaning, tags = []) => ({id, text: '-' + id, meaning, tags});
  const rootsOf = (subject, records) => records.map(([id, meaning]) => ({id, text:id, meaning, subject}));
  const prefixes = [
    p('anti','against or opposed to',['against']),p('counter','in opposition to',['against']),p('contra','against',['against']),
    p('micro','very small',['small']),p('nano','extremely small',['small']),p('mini','small',['small']),
    p('hyper','excessive or beyond normal',['excess']),p('ultra','extreme or beyond',['excess']),p('over','too much or above',['excess']),
    p('multi','many',['many']),p('poly','many',['many']),p('omni','all',['all']),
    p('pre','before',['before']),p('post','after',['after']),p('re','again',['again']),
    p('neo','new or revived',['new']),p('pseudo','false or imitation',['false']),
    p('non','not or absence of',['not']),p('un','not or reversal',['not']),p('dis','not, apart, or opposite',['not']),
    p('inter','between or among',['between']),p('intra','within',['within']),p('trans','across or change',['across']),
    p('sub','under or below',['under']),p('super','above or beyond',['above']),
    p('geo','Earth',['earth']),p('bio','life',['life']),p('hydro','water',['water']),
    p('thermo','heat',['heat']),p('photo','light',['light']),p('eco','environment or home',['environment']),
    p('aero','air',['air']),p('mega','large',['large']),p('semi','half',['half']),p('hemi','half',['half']),
    p('bi','two',['two']),p('endo','within or inward',['inside']),p('exo','outside',['outside']),
    p('de','remove or reverse',['reverse']),p('mis','wrongly',['wrong'])
  ];
  const suffixes = [
    s('ist','a person associated with something',['person']),
    s('ologist','someone who studies a subject',['student']),
    s('ology','the study of something',['study']),
    s('phile','a lover or enthusiast of something',['lover']),
    s('phobe','someone with an aversion or fear',['aversion']),
    s('phobic','having an aversion or fear',['aversion']),
    s('meter','a measuring device',['measurer']),
    s('scope','an instrument for viewing',['viewer']),
    s('graph','a record or recording device',['record']),
    s('graphy','recording or describing',['record']),
    s('ism','a belief, practice, or tendency',['practice']),
    s('ness','a state or quality',['state']),s('ity','a state or quality',['state']),
    s('hood','a state or period',['state']),s('ship','a condition or relationship',['state']),
    s('ful','full of',['full']),s('less','without',['without']),
    s('able','capable of or suitable for',['capable']),s('ible','capable of',['capable']),
    s('ic','relating to',['related']),s('al','relating to',['related']),s('ial','relating to',['related']),
    s('ous','full of or characterized by',['full']),s('ary','relating to',['related']),s('ive','tending to',['related']),
    s('ize','make or cause to become',['make']),s('ify','make or cause to become',['make']),
    s('ment','a process or result',['process']),s('ation','an act or process',['process']),
    s('ion','an act or result',['process']),s('tion','an act or process',['process']),
    s('er','a person or device that does something',['person']),s('or','a person or thing that acts',['person']),
    s('ing','an ongoing action or process',['process']),
    s('oid','resembling',['resembles']),s('like','resembling',['resembles']),
    s('proof','resistant to something',['resists']),s('ward','in a direction',['direction'])
  ];
  const roots = [
    ...rootsOf('math',[
      ['fraction','part of a whole'],['triangle','three-sided polygon'],['equation','statement that two expressions are equal'],
      ['graph','visual representation of relationships'],['angle','amount of turn'],['number','quantity or value'],
      ['pattern','a regularity'],['symmetry','balanced correspondence'],['geometry','study of shapes and space'],
      ['ratio','comparison of quantities'],['decimal','base-ten number form'],['polygon','many-sided figure'],
      ['circle','points a fixed distance from a centre'],['integer','whole number, positive, negative or zero'],
      ['function','input-output relationship'],['vector','quantity with magnitude and direction'],
      ['matrix','rectangular array of entries'],['variable','symbol for a changing or unknown value'],
      ['parallel','never meeting in the same plane'],['algebra','generalized number relationships'],
      ['form','shape'],['sect','cut'],['arrange','put in order'],['group','collect together'],
      ['tract','draw or pull'],['equal','the same amount'],['state','express or declare']
    ]),
    ...rootsOf('science',[
      ['therm','heat'],['thermo','heat (combining form)'],['bio','life'],['photo','light'],['hydro','water'],['cloud','a visible collection of droplets or ice crystals'],
      ['volcano','opening through which magma may erupt'],['alga','a photosynthetic aquatic organism'],
      ['atom','smallest unit of an element'],['magnet','object producing a magnetic field'],
      ['orbit','path around a body'],['planet','large body orbiting a star'],['neuron','nerve cell'],
      ['cell','basic unit of life'],['carbon','chemical element C'],['oxygen','chemical element O'],
      ['crystal','solid with an ordered internal structure'],['microbe','microscopic organism'],
      ['energy','capacity to produce change'],['chem','chemical substances or reactions'],['eco','environment or home'],
      ['degrad','break down'],['scope','look or view'],['organism','living thing'],
      ['phob','fear or aversion'],['log','study or account']
    ]),
    ...rootsOf('geography',[
      ['map','representation of places'],['mountain','high landform'],['river','flowing watercourse'],
      ['ocean','large body of saltwater'],['continent','major landmass'],['valley','low land between higher areas'],
      ['coast','boundary between land and sea'],['glacier','slow-moving mass of ice'],['climate','long-term weather patterns'],
      ['forest','land dominated by trees'],['desert','very dry region'],['island','land surrounded by water'],
      ['latitude','position north or south of the equator'],['longitude','position east or west of a reference meridian'],
      ['land','solid surface of Earth'],['city','large human settlement'],['urban','relating to a town or city'],
      ['terrain','physical landscape'],['tecton','building or structure of Earth’s crust'],
      ['world','Earth or its inhabitants'],['nation','a people or political community'],
      ['sphere','rounded body or region'],['cultur','culture or cultivation']
    ]),
    ...rootsOf('history',[
      ['empire','territories ruled by a central authority'],['king','male monarch'],['castle','fortified residence'],
      ['chron','time'],['archiv','historical records'],['treaty','formal agreement'],['reform','change for improvement'],
      ['colon','settlement or colonization'],['democracy','rule by the people'],['dynasty','family line of rulers'],
      ['war','armed conflict'],['revolution','major political or social change'],['monarch','hereditary sovereign'],
      ['culture','shared practices and ideas'],['migration','movement between places'],['ancient','very old'],
      ['civil','relating to citizens'],['histor','history'],['era','period of time'],
      ['construct','build'],['imperial','relating to an empire']
    ]),
    ...rootsOf('english',[
      ['adjective','word that describes a noun'],['comma','punctuation mark'],['poem','literary composition in verse'],
      ['metaphor','figurative comparison'],['phon','sound'],['lex','word'],['narrat','tell or recount'],
      ['predict','say in advance'],['interpret','explain meaning'],['phrase','group of words'],
      ['clause','group of words with a subject and verb'],['syntax','rules of sentence structure'],
      ['fiction','invented narrative'],['story','sequence of events'],['rhyme','repeated ending sounds'],
      ['script','written text'],['grammar','language structure'],['literal','following ordinary meaning'],
      ['character','person in a story'],['verse','line or group of lines in poetry'],
      ['agree','share an opinion'],['write','put words into text'],['view','look at'],
      ['help','assist'],['care','concern or attention'],['read','interpret written words']
    ])
  ];
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