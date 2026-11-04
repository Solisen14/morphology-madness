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
  real.push(...[
    {...R('grade9math',"A number expressible as a ratio of two integers, with a nonzero denominator.",null,"ration","al","rational","A rational number can be written as a ratio of integers."),strand:'B'},
    {...R('grade9math',"A number not expressible as a ratio of two integers.","ir","rational",null,"irrational","The square root of 2 is irrational."),strand:'B'},
    {...R('grade9math',"A statement comparing quantities using symbols such as <, >, or ≥.","in","equal","ity","inequality","An inequality compares two values or expressions using comparison symbols."),strand:'B'},
    {...R('grade9math',"Adjusting a number to a nearby value at a specified place value.",null,"round","ing","rounding","Rounding produces an approximation at a chosen place value."),strand:'B'},
    {...R('grade9math',"Finding an approximate value.",null,"estim","ation","estimation","Estimation helps check whether a computed answer is reasonable."),strand:'B'},
    {...R('grade9math',"An amount expressed as a number per hundred.",null,"percent","age","percentage","A percentage represents an amount per hundred, such as 25%."),strand:'B'},
    {...R('grade9math',"Describing a relation with a rate of change that is not constant.","non","linear",null,"nonlinear","The rate of change of a nonlinear relation is not constant."),strand:'C'},
    {...R('grade9math',"Describing a relationship in which two ratios are equal.",null,"proportion","al","proportional","A proportional relation can be represented by y = kx."),strand:'C'},
    {...R('grade9math',"Describing a relation with a variable in the exponent.",null,"exponent","ial","exponential","An exponential relation can change by the same factor over equal input steps."),strand:'C'},
    {...R('grade9math',"An algebraic expression consisting of two terms.","bi","nom","ial","binomial","x + 4 is a binomial."),strand:'C'},
    {...R('grade9math',"An algebraic expression formed by a sum of terms with whole-number exponents.","poly","nom","ial","polynomial","3x² + x - 2 is a polynomial."),strand:'C'},
    {...R('grade9math',"To rewrite an expression into a simpler equivalent form.",null,"simpl","ify","simplify","Simplifying changes the form without changing the value."),strand:'C'},
    {...R('grade9math',"A mathematical quantity represented by a symbol whose value may change.",null,"vari","able","variable","A variable may represent many values or an unknown value."),strand:'C'},
    {...R('grade9math',"A variable chosen or controlled rather than determined by another variable.","in","dependent",null,"independent","The independent variable is often on the horizontal graph axis."),strand:'C'},
    {...R('grade9math',"The act of repeating an instruction or process.",null,"iterat","ion","iteration","A coding loop uses iteration to repeat steps."),strand:'C'},
    {...R('grade9math',"An association between two sets of values.",null,"correlat","ion","correlation","Correlation does not, by itself, establish causation."),strand:'D'},
    {...R('grade9math',"Describing the spread between the first and third quartile.","inter","quartile",null,"interquartile","The interquartile range is Q3 minus Q1."),strand:'D'},
    {...R('grade9math',"Imitating a situation using a mathematical or computational model.",null,"simulat","ion","simulation","Simulations can examine possible results of a process."),strand:'D'},
    {...R('grade9math',"A statement about an expected result based on patterns or information.","pre","dict","ion","prediction","Predictions draw on evidence or models."),strand:'D'},
    {...R('grade9math',"A transformation producing a mirror image across a line.","re","flect","ion","reflection","A reflection maps a figure across a line of reflection."),strand:'E'},
    {...R('grade9math',"A transformation turning a figure around a fixed point.",null,"rotat","ion","rotation","A rotation turns around a centre through a given angle."),strand:'E'},
    {...R('grade9math',"A transformation changing size by a scale factor.",null,"dilat","ion","dilation","A dilation changes distances from a centre by a scale factor."),strand:'E'},
    {...R('grade9math',"A polygon with four sides.","quadri","later","al","quadrilateral","Rectangles and parallelograms are quadrilaterals."),strand:'E'},
    {...R('grade9math',"A closed two-dimensional figure formed from straight sides.","poly","gon",null,"polygon","Triangles and pentagons are polygons."),strand:'E'},
    {...R('grade9math',"The total distance around the outside edge of a shape.","peri","meter",null,"perimeter","Perimeter is measured in units of length."),strand:'E'},
    {...R('grade9math',"A change in a figure's location, orientation, or size.","trans","form","ation","transformation","Examples include translations, reflections, rotations and dilations."),strand:'E'},
    {...R('grade9math',"A decrease in the monetary value of an asset over time.","de","preci","ation","depreciation","Depreciation describes falling asset value."),strand:'F'},
    {...R('grade9math',"Planning how income can cover spending and saving.",null,"budget","ing","budgeting","A budget helps plan income and expenses."),strand:'F'},
    {...R('grade9math',"A general rise in prices over time.",null,"inflat","ion","inflation","Inflation changes the purchasing power of money."),strand:'F'},
    {...R('grade9math',"The process or system of charging taxes.",null,"tax","ation","taxation","Taxes affect the cost of purchases and income."),strand:'F'}
  ]);
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
  creative.push(...[
    {...C('grade9math',"A person who is absurdly excited by fractions.","excess","fraction","person"),strand:'B'},
    {...C('grade9math',"The study of impossibly tiny rational numbers.","small","rational","study"),strand:'B'},
    {...C('grade9math',"A person who strongly opposes algebraic equations.","against","equation","person"),strand:'C'},
    {...C('grade9math',"Relating to a wildly excessive number of variables.","many","variable","related"),strand:'C'},
    {...C('grade9math',"A fictional new practice for making patterns.","new","pattern","practice"),strand:'C'},
    {...C('grade9math',"The study of predictions after an imaginary simulation.","after","simulat","study"),strand:'D'},
    {...C('grade9math',"A device for measuring very tiny changes in slope.","small","slope","measurer"),strand:'D'},
    {...C('grade9math',"Someone who campaigns against data.","against","data","person"),strand:'D'},
    {...C('grade9math',"A person with an excessive love of polygons.","excess","polygon","lover"),strand:'E'},
    {...C('grade9math',"The study of impossibly tiny angles.","small","angle","study"),strand:'E'},
    {...C('grade9math',"Relating to many rotations of a shape.","many","rotat","related"),strand:'E'},
    {...C('grade9math',"Someone firmly opposed to taxes.","against","tax","person"),strand:'F'},
    {...C('grade9math',"The study of a budget before any income arrives.","before","budget","study"),strand:'F'},
    {...C('grade9math',"A device measuring microscopic amounts of interest.","small","interest","measurer"),strand:'F'},
    {...C('grade9math',"A fictional new practice for managing money.","new","budget","practice"),strand:'F'}
  ]);
  const sparks = {
    grade9math:['Invent a new mathematical process.','Name an imaginary number pattern.','Describe a strange financial discovery.','Create a word for an unusual data relationship.','Invent an impossible geometric transformation.'],
    math:['Give a mathematical idea a surprising new identity.','What could a mysterious numerical creature be called?','Invent something a geometry teacher might never have encountered.','Create a term for an imaginary pattern or operation.','Try a mathematically themed invention that sounds almost believable.'],
    science:['Invent a fictional scientific instrument or creature.','Name an imaginary biological phenomenon.','Create the name of a process from an alternate universe.','Think of an improbable scientific discovery.','Invent something a scientist might find under a microscope.'],
    geography:['Invent a new kind of landscape or map feature.','Name a fictional phenomenon in the atmosphere.','Create a term for a peculiar geographic region.','Imagine explorers naming a remarkable new feature.','What could an unusual environmental phenomenon be called?'],
    history:['Invent a term for an imaginary historical movement.','Name a fictional institution or social practice.','Describe a peculiar event from an invented civilization.','Create a label for an imaginary historical era.','What might historians call an unusual new discovery?'],
    english:['Invent a term for a strange literary habit.','Describe an imaginary grammatical phenomenon.','Give a new poetic technique a name.','Invent a term for an unusual style of storytelling.','Create a word for a very specific reading experience.']
  };
  const subjects = {math:'Mathematics',grade9math:'Grade 9 Math',science:'Science',geography:'Geography',history:'History',english:'English'};
  window.MM_DATA = {subjects,prefixes,roots,suffixes,real,creative,sparks};
})();