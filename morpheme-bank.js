/* Morphology Madness morpheme bank v1.3.
 * Shared by all three solo game modes.
 * Many school-domain bases are complete words, not classical bound roots.
 * A valid morpheme sequence is NOT automatically a valid dictionary word.
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
    p('pre','before',['before']),p('post','after',['after']),p('re','again or back',['again']),
    p('neo','new or revived',['new']),p('pseudo','false or imitation',['false']),
    p('non','not or absence of',['not']),p('un','not or reversal',['not']),p('dis','not, apart, or opposite',['not']),
    p('inter','between or among',['between']),p('intra','within',['within']),p('trans','across or change',['across']),
    p('sub','under, below, or in place of',['under']),p('super','above or beyond',['above']),
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
      ['graph','a record or visual representation of information'],['angle','amount of turn'],['number','quantity or value'],
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
      ['culture','cultivation, or shared practices and ideas'],['migration','movement between places'],['ancient','very old'],
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


  // Additional entries are editorial drafts. Each keeps the legacy id/text/meaning/tags
  // needed by the existing game and gains structured metadata for future validation.
  const additions = {
  "schemaVersion": 1,
  "prefixes": [
    {
      "id": "auto",
      "meaning": "self",
      "tags": [
        "self"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "autobiography",
      "reviewNote": null
    },
    {
      "id": "allo",
      "meaning": "other or different",
      "tags": [
        "other"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "allophone",
      "reviewNote": null
    },
    {
      "id": "ambi",
      "meaning": "both or on both sides",
      "tags": [
        "both"
      ],
      "formClass": "prefix",
      "exampleWord": "ambidextrous",
      "reviewNote": null
    },
    {
      "id": "ante",
      "meaning": "before",
      "tags": [
        "before"
      ],
      "formClass": "prefix",
      "exampleWord": "antecedent",
      "reviewNote": null
    },
    {
      "id": "arch",
      "meaning": "chief or principal",
      "tags": [
        "chief"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "archbishop",
      "reviewNote": "multiple histories and meanings; examine example"
    },
    {
      "id": "circum",
      "meaning": "around",
      "tags": [
        "around"
      ],
      "formClass": "prefix",
      "exampleWord": "circumnavigate",
      "reviewNote": null
    },
    {
      "id": "co",
      "meaning": "together or jointly",
      "tags": [
        "together"
      ],
      "formClass": "prefix",
      "exampleWord": "cooperate",
      "reviewNote": null
    },
    {
      "id": "com",
      "meaning": "together or with",
      "tags": [
        "together"
      ],
      "formClass": "prefix",
      "exampleWord": "combine",
      "reviewNote": "changes form depending on the following sound"
    },
    {
      "id": "con",
      "meaning": "together or with",
      "tags": [
        "together"
      ],
      "formClass": "prefix",
      "exampleWord": "connect",
      "reviewNote": "changes form depending on the following sound"
    },
    {
      "id": "dia",
      "meaning": "through or across",
      "tags": [
        "through"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "diameter",
      "reviewNote": "Greek combining form, not freely attaching English prefix"
    },
    {
      "id": "dys",
      "meaning": "difficult, impaired, or abnormal",
      "tags": [
        "difficulty"
      ],
      "formClass": "prefix",
      "exampleWord": "dysfunction",
      "reviewNote": null
    },
    {
      "id": "eu",
      "meaning": "good or well",
      "tags": [
        "good"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "euphoria",
      "reviewNote": null
    },
    {
      "id": "extra",
      "meaning": "outside or beyond",
      "tags": [
        "outside"
      ],
      "formClass": "prefix",
      "exampleWord": "extracurricular",
      "reviewNote": null
    },
    {
      "id": "hetero",
      "meaning": "different",
      "tags": [
        "different"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "heterogeneous",
      "reviewNote": null
    },
    {
      "id": "homo",
      "meaning": "same",
      "tags": [
        "same"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "homogeneous",
      "reviewNote": "same as Greek form, distinct from English homonyms"
    },
    {
      "id": "iso",
      "meaning": "equal or same",
      "tags": [
        "same"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "isometric",
      "reviewNote": null
    },
    {
      "id": "macro",
      "meaning": "large or on a large scale",
      "tags": [
        "large"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "macroeconomics",
      "reviewNote": null
    },
    {
      "id": "meta",
      "meaning": "change, beyond, or about itself",
      "tags": [
        "change"
      ],
      "formClass": "prefix",
      "exampleWord": "metadata",
      "reviewNote": "multiple senses, often specialized"
    },
    {
      "id": "mono",
      "meaning": "one or single",
      "tags": [
        "one"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "monologue",
      "reviewNote": null
    },
    {
      "id": "pan",
      "meaning": "all or whole",
      "tags": [
        "all"
      ],
      "formClass": "prefix",
      "exampleWord": "pancontinental",
      "reviewNote": "may combine via spelling or linking vowels"
    },
    {
      "id": "peri",
      "meaning": "around or surrounding",
      "tags": [
        "around"
      ],
      "formClass": "prefix",
      "exampleWord": "perimeter",
      "reviewNote": null
    },
    {
      "id": "proto",
      "meaning": "first or earliest",
      "tags": [
        "first"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "prototype",
      "reviewNote": null
    },
    {
      "id": "retro",
      "meaning": "backward or in the past",
      "tags": [
        "back"
      ],
      "formClass": "prefix",
      "exampleWord": "retroactive",
      "reviewNote": null
    },
    {
      "id": "syn",
      "meaning": "together or with",
      "tags": [
        "together"
      ],
      "formClass": "prefix",
      "exampleWord": "synthesis",
      "reviewNote": null
    },
    {
      "id": "tele",
      "meaning": "far or at a distance",
      "tags": [
        "distance"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "telephone",
      "reviewNote": null
    },
    {
      "id": "tri",
      "meaning": "three",
      "tags": [
        "three"
      ],
      "formClass": "prefix",
      "exampleWord": "triangle",
      "reviewNote": null
    },
    {
      "id": "tetra",
      "meaning": "four",
      "tags": [
        "four"
      ],
      "formClass": "initial_combining_form",
      "exampleWord": "tetrahedron",
      "reviewNote": null
    },
    {
      "id": "quadri",
      "meaning": "four",
      "tags": [
        "four"
      ],
      "formClass": "prefix",
      "exampleWord": "quadrilateral",
      "reviewNote": null
    },
    {
      "id": "uni",
      "meaning": "one",
      "tags": [
        "one"
      ],
      "formClass": "prefix",
      "exampleWord": "unilateral",
      "reviewNote": null
    },
    {
      "id": "hypo",
      "meaning": "below or less than normal",
      "tags": [
        "under"
      ],
      "formClass": "prefix",
      "exampleWord": "hypothermia",
      "reviewNote": null
    }
  ],
  "suffixes": [
    {
      "id": "ed",
      "meaning": "past tense or past participle",
      "tags": [
        "past"
      ],
      "formClass": "inflectional_suffix",
      "exampleWord": "jumped",
      "reviewNote": "past-tense spelling often changes"
    },
    {
      "id": "s",
      "meaning": "plural noun or third-person singular verb",
      "tags": [
        "plural"
      ],
      "formClass": "inflectional_suffix",
      "exampleWord": "graphs",
      "reviewNote": "ambiguous plural versus verb agreement"
    },
    {
      "id": "es",
      "meaning": "plural or verb ending in certain spelling patterns",
      "tags": [
        "plural"
      ],
      "formClass": "inflectional_suffix",
      "exampleWord": "boxes",
      "reviewNote": "spelling restrictions; not freely attachable"
    },
    {
      "id": "ly",
      "meaning": "in a particular way; often forms an adverb",
      "tags": [
        "manner"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "quickly",
      "reviewNote": null
    },
    {
      "id": "est",
      "meaning": "most, in comparisons",
      "tags": [
        "superlative"
      ],
      "formClass": "inflectional_suffix",
      "exampleWord": "smallest",
      "reviewNote": "comparison only for suitable adjectives"
    },
    {
      "id": "ance",
      "meaning": "a state, action, or process",
      "tags": [
        "state"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "resistance",
      "reviewNote": null
    },
    {
      "id": "ence",
      "meaning": "a state, action, or quality",
      "tags": [
        "state"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "difference",
      "reviewNote": null
    },
    {
      "id": "ency",
      "meaning": "a condition, state, or quality",
      "tags": [
        "state"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "fluency",
      "reviewNote": null
    },
    {
      "id": "acy",
      "meaning": "a state or quality",
      "tags": [
        "state"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "accuracy",
      "reviewNote": null
    },
    {
      "id": "dom",
      "meaning": "a state, condition, or domain",
      "tags": [
        "state"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "freedom",
      "reviewNote": null
    },
    {
      "id": "en",
      "meaning": "make or become",
      "tags": [
        "make"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "widen",
      "reviewNote": null
    },
    {
      "id": "ish",
      "meaning": "somewhat or having qualities of",
      "tags": [
        "resembles"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "greenish",
      "reviewNote": null
    },
    {
      "id": "ette",
      "meaning": "small or miniature; sometimes diminutive",
      "tags": [
        "small"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "kitchenette",
      "reviewNote": "diminutive with context-specific connotations"
    },
    {
      "id": "let",
      "meaning": "small or young",
      "tags": [
        "small"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "booklet",
      "reviewNote": null
    },
    {
      "id": "ate",
      "meaning": "make, cause, or perform an action",
      "tags": [
        "make"
      ],
      "formClass": "derivational_suffix",
      "exampleWord": "activate",
      "reviewNote": "requires a compatible base; not universal"
    },
    {
      "id": "genic",
      "meaning": "producing, generated by, or caused by",
      "tags": [
        "produces"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "photogenic",
      "reviewNote": "specialized meaning and spelling"
    },
    {
      "id": "genesis",
      "meaning": "origin or formation",
      "tags": [
        "origin"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "biogenesis",
      "reviewNote": null
    },
    {
      "id": "phobia",
      "meaning": "strong fear or aversion",
      "tags": [
        "aversion"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "arachnophobia",
      "reviewNote": null
    },
    {
      "id": "cracy",
      "meaning": "form of rule or government",
      "tags": [
        "government"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "democracy",
      "reviewNote": null
    },
    {
      "id": "archy",
      "meaning": "rule, government, or leadership",
      "tags": [
        "government"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "monarchy",
      "reviewNote": null
    },
    {
      "id": "tomy",
      "meaning": "cutting or incision",
      "tags": [
        "cutting"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "anatomy",
      "reviewNote": "a Greek final combining form; not a suffix on any root"
    },
    {
      "id": "cyte",
      "meaning": "cell",
      "tags": [
        "cell"
      ],
      "formClass": "final_combining_form",
      "exampleWord": "leukocyte",
      "reviewNote": null
    }
  ],
  "roots": {
    "math": [
      {
        "id": "add",
        "meaning": "combine quantities",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "sum",
        "meaning": "result of addition",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "product",
        "meaning": "result of multiplication",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "factor",
        "meaning": "number or expression multiplied with another",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "multiple",
        "meaning": "product of a number and an integer",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "prime",
        "meaning": "number with exactly two positive factors when greater than one",
        "formClass": "free_base",
        "reviewNote": "prime number definition requires restriction to integers greater than one"
      },
      {
        "id": "radius",
        "meaning": "distance from a circle centre to its boundary",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "diameter",
        "meaning": "distance across a circle through its centre",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "perimeter",
        "meaning": "distance around a shape",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "area",
        "meaning": "measure of a two-dimensional region",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "volume",
        "meaning": "measure of three-dimensional space",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "coordinate",
        "meaning": "number used to specify position",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "scale",
        "meaning": "relative size or ratio",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "estimate",
        "meaning": "approximate calculation",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "probability",
        "meaning": "measure of likelihood",
        "formClass": "free_base",
        "reviewNote": "full-word base, not a Greek/Latin bound root"
      },
      {
        "id": "chance",
        "meaning": "possibility of an event",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "mean",
        "meaning": "arithmetic average",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "median",
        "meaning": "middle value in ordered data",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "mode",
        "meaning": "most frequent value in a data set",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "sequence",
        "meaning": "ordered list of numbers or objects",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "term",
        "meaning": "individual number or expression in a sequence",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "limit",
        "meaning": "value approached",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "inverse",
        "meaning": "operation or relation that reverses another",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "transform",
        "meaning": "change position, shape, or size",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "reflect",
        "meaning": "produce a mirror image across a line or plane",
        "formClass": "free_base",
        "reviewNote": null
      }
    ],
    "science": [
      {
        "id": "force",
        "meaning": "push or pull that can change motion",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "mass",
        "meaning": "amount of matter or inertial property",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "motion",
        "meaning": "change in position over time",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "gravity",
        "meaning": "attractive interaction between masses",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "electric",
        "meaning": "relating to electric charge",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "charge",
        "meaning": "property of matter involved in electric interactions",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "light",
        "meaning": "visible electromagnetic radiation",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "sound",
        "meaning": "vibrations transmitted as waves",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "wave",
        "meaning": "disturbance transferring energy",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "react",
        "meaning": "undergo or cause a chemical change",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "molecule",
        "meaning": "group of bonded atoms",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "protein",
        "meaning": "biological macromolecule made of amino acids",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "enzyme",
        "meaning": "molecule that speeds up a chemical reaction",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "genome",
        "meaning": "complete genetic material of an organism",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "gene",
        "meaning": "unit of heredity represented by a DNA sequence",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "evolve",
        "meaning": "change across generations",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "adapt",
        "meaning": "adjust or change in response to conditions",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "habitat",
        "meaning": "place where an organism lives",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "species",
        "meaning": "classification of related organisms",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "bacterium",
        "meaning": "single-celled prokaryotic organism",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "fungus",
        "meaning": "organism such as yeast, mould, or mushroom",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "nucleus",
        "meaning": "central part of an atom or membrane-bound cell structure",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "fluid",
        "meaning": "substance that flows",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "velocity",
        "meaning": "speed with direction",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "acoust",
        "meaning": "sound or hearing",
        "formClass": "bound_root",
        "reviewNote": "bound form seen in acoustic, acoustics"
      },
      {
        "id": "astro",
        "meaning": "star or outer space",
        "formClass": "bound_root",
        "reviewNote": null
      },
      {
        "id": "spectr",
        "meaning": "spectrum or visible appearance",
        "formClass": "bound_root",
        "reviewNote": null
      }
    ],
    "geography": [
      {
        "id": "earth",
        "meaning": "the planet or its land",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "plate",
        "meaning": "large section of Earth’s lithosphere",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "border",
        "meaning": "boundary between areas",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "region",
        "meaning": "area with shared characteristics",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "population",
        "meaning": "people living in an area",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "settle",
        "meaning": "establish a community or home",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "transport",
        "meaning": "move people or goods",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "resource",
        "meaning": "material or asset people use",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "weather",
        "meaning": "short-term atmospheric conditions",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "rain",
        "meaning": "liquid precipitation",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "wind",
        "meaning": "moving air",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "soil",
        "meaning": "upper layer of Earth in which plants grow",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "erosion",
        "meaning": "movement of weathered material",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "delta",
        "meaning": "sediment-built land near a river mouth",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "estuary",
        "meaning": "coastal area where fresh and salt water mix",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "tributary",
        "meaning": "stream flowing into a larger stream",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "watershed",
        "meaning": "area draining to a common waterbody",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "altitude",
        "meaning": "height above sea level",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "elevation",
        "meaning": "height above a reference level",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "equator",
        "meaning": "imaginary line halfway between the poles",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "hemispher",
        "meaning": "half of a sphere",
        "formClass": "bound_root",
        "reviewNote": "bound spelling form used in hemisphere"
      },
      {
        "id": "carto",
        "meaning": "map or chart",
        "formClass": "bound_root",
        "reviewNote": "combining form used in cartography"
      },
      {
        "id": "demograph",
        "meaning": "human population statistics",
        "formClass": "bound_root",
        "reviewNote": null
      },
      {
        "id": "topo",
        "meaning": "place or surface features",
        "formClass": "bound_root",
        "reviewNote": null
      },
      {
        "id": "agri",
        "meaning": "field, farming, or agriculture",
        "formClass": "bound_root",
        "reviewNote": null
      }
    ],
    "history": [
      {
        "id": "artifact",
        "meaning": "object made or used by people in the past",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "source",
        "meaning": "record or evidence used to study a past event",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "evidence",
        "meaning": "information supporting a claim",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "timeline",
        "meaning": "chronological representation of events",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "trade",
        "meaning": "exchange of goods or services",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "market",
        "meaning": "place or system of exchange",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "merchant",
        "meaning": "person engaged in trade",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "govern",
        "meaning": "exercise political authority",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "policy",
        "meaning": "plan or guiding rule",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "citizen",
        "meaning": "member of a political community",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "rights",
        "meaning": "entitlements protected by law or principle",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "vote",
        "meaning": "express a choice in a decision",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "protest",
        "meaning": "public expression of objection",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "chronicle",
        "meaning": "chronological account of events",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "century",
        "meaning": "period of one hundred years",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "decade",
        "meaning": "period of ten years",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "millennium",
        "meaning": "period of one thousand years",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "monument",
        "meaning": "structure honouring or remembering something",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "republic",
        "meaning": "state where power is not held by a hereditary monarch",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "labour",
        "meaning": "work done by people",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "industry",
        "meaning": "economic activity producing goods or services",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "factory",
        "meaning": "building for manufacturing",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "resist",
        "meaning": "oppose or withstand",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "conquest",
        "meaning": "taking control through force",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "heritage",
        "meaning": "inherited cultural or historical traditions",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "abolish",
        "meaning": "formally put an end to a practice or institution",
        "formClass": "free_base",
        "reviewNote": null
      }
    ],
    "english": [
      {
        "id": "author",
        "meaning": "person who writes or creates a work",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "edit",
        "meaning": "revise or prepare written material",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "revise",
        "meaning": "change to improve written work",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "sentence",
        "meaning": "grammatical unit expressing a complete thought",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "paragraph",
        "meaning": "group of related sentences",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "punct",
        "meaning": "point or mark in writing",
        "formClass": "bound_root",
        "reviewNote": null
      },
      {
        "id": "prose",
        "meaning": "ordinary written language other than verse",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "drama",
        "meaning": "literary work intended for performance",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "dialogue",
        "meaning": "conversation represented in writing",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "voice",
        "meaning": "distinctive style or narrative perspective",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "tone",
        "meaning": "attitude conveyed through language",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "mood",
        "meaning": "emotional atmosphere of a text",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "genre",
        "meaning": "category of literary or artistic work",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "theme",
        "meaning": "central idea explored in a text",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "image",
        "meaning": "mental picture evoked by words",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "symbol",
        "meaning": "something representing another idea",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "persuade",
        "meaning": "convince through reasoning or language",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "argue",
        "meaning": "present a position with reasons",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "critique",
        "meaning": "careful evaluation of a work",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "context",
        "meaning": "surrounding words or circumstances",
        "formClass": "free_base",
        "reviewNote": null
      },
      {
        "id": "vocab",
        "meaning": "words or vocabulary",
        "formClass": "bound_root",
        "reviewNote": null
      },
      {
        "id": "figur",
        "meaning": "figure or form",
        "formClass": "bound_root",
        "reviewNote": null
      },
      {
        "id": "alliter",
        "meaning": "repetition of initial sounds",
        "formClass": "bound_root",
        "reviewNote": "bound form seen in alliteration"
      },
      {
        "id": "rhetor",
        "meaning": "persuasive speaking or writing",
        "formClass": "bound_root",
        "reviewNote": "bound form seen in rhetoric, rhetorical"
      }
    ]
  },
  "metadata": {
    "boundRoots": [
      "acoust",
      "agri",
      "alliter",
      "archiv",
      "astro",
      "bio",
      "carto",
      "chem",
      "chron",
      "colon",
      "construct",
      "cultur",
      "degrad",
      "demograph",
      "eco",
      "figur",
      "hemispher",
      "histor",
      "hydro",
      "lex",
      "log",
      "narrat",
      "phob",
      "phon",
      "photo",
      "punct",
      "rhetor",
      "spectr",
      "tecton",
      "therm",
      "thermo",
      "topo",
      "vocab"
    ],
    "prefixCombining": [
      "aero",
      "allo",
      "auto",
      "bio",
      "dia",
      "eco",
      "eu",
      "geo",
      "hetero",
      "homo",
      "hydro",
      "iso",
      "macro",
      "mono",
      "photo",
      "proto",
      "tele",
      "tetra",
      "thermo"
    ],
    "suffixCombining": [
      "archy",
      "cracy",
      "cyte",
      "genesis",
      "genic",
      "graph",
      "graphy",
      "meter",
      "ologist",
      "ology",
      "phile",
      "phobe",
      "phobia",
      "phobic",
      "scope",
      "tomy"
    ],
    "reviewFlags": {
      "prefix": {
        "arch": "multiple histories and meanings; examine example",
        "com": "changes form depending on the following sound",
        "con": "changes form depending on the following sound",
        "dia": "Greek combining form, not freely attaching English prefix",
        "meta": "multiple senses, often specialized",
        "homo": "same as Greek form, distinct from English homonyms",
        "pan": "may combine via spelling or linking vowels"
      },
      "suffix": {
        "s": "ambiguous plural versus verb agreement",
        "es": "spelling restrictions; not freely attachable",
        "ed": "past-tense spelling often changes",
        "est": "comparison only for suitable adjectives",
        "ate": "requires a compatible base; not universal",
        "tomy": "a Greek final combining form; not a suffix on any root",
        "genic": "specialized meaning and spelling",
        "ette": "diminutive with context-specific connotations"
      },
      "base": {
        "prime": "prime number definition requires restriction to integers greater than one",
        "probability": "full-word base, not a Greek/Latin bound root",
        "hemispher": "bound spelling form used in hemisphere",
        "rhetor": "bound form seen in rhetoric, rhetorical",
        "alliter": "bound form seen in alliteration",
        "acoust": "bound form seen in acoustic, acoustics",
        "carto": "combining form used in cartography"
      }
    }
  }
};
  const fromPrefix = record => ({
    id:record.id,text:record.id+'-',meaning:record.meaning,tags:[...record.tags],
    formClass:record.formClass,exampleWord:record.exampleWord,
    reviewNote:record.reviewNote||null,source:'expanded-draft'
  });
  const fromSuffix = record => ({
    id:record.id,text:'-'+record.id,meaning:record.meaning,tags:[...record.tags],
    formClass:record.formClass,exampleWord:record.exampleWord,
    reviewNote:record.reviewNote||null,source:'expanded-draft'
  });
  for(const entry of additions.prefixes)prefixes.push(fromPrefix(entry));
  for(const entry of additions.suffixes)suffixes.push(fromSuffix(entry));
  for(const [subject,entries] of Object.entries(additions.roots)){
    for(const entry of entries)roots.push({
      ...entry,text:entry.id,subject,source:'expanded-draft'
    });
  }
  const boundRoots = new Set(additions.metadata.boundRoots);
  const initialCombining = new Set(additions.metadata.prefixCombining);
  const finalCombining = new Set(additions.metadata.suffixCombining);
  const restrictedCreativeSuffixes = new Set(['ed','s','es','est']);

  // A root can be meaningful without standing alone as an English word.
  // Explicit labels help teachers distinguish word stems from free bases.
  const grade9BoundRootIds=new Set(["nom","flect","rotat","dilat","later","gon","correlat","simulat","preci","inflat","estim","simpl","ration","dict","vari","iterat","divis","calcul","tribut","stitut","valent","variate","fer","metr","charg"]);

  // MTH1W roots remain in one shared bank without duplicate IDs.
  const grade9SharedMathIds=new Set(["fraction","triangle","equation","graph","angle","number","pattern","symmetry","geometry","ratio","decimal","polygon","circle","integer","function","variable","parallel","algebra","form","sect","arrange","group","tract","equal","add","sum","product","factor","multiple","prime","radius","diameter","perimeter","area","volume","coordinate","scale","estimate","probability","chance","mean","median","mode","sequence","term","inverse","transform","reflect"]);
  for(const [id,meaning,tags,exampleWord] of [["in","not (as in inequality)",["not"],"inequality"],["ir","not (before certain r-beginning stems)",["not"],"irrational"]])prefixes.push({...p(id,meaning,tags),source:'grade9-math',formClass:'prefix',exampleWord});
  for(const [id,meaning,tags,exampleWord] of [["age","an amount, measure, or result",["amount"],"percentage"]])suffixes.push({...s(id,meaning,tags),source:'grade9-math',formClass:'derivational_suffix',exampleWord});
  roots.push(...rootsOf('grade9math',[["linear","relation with a constant rate of change"],["proportion","equality of two ratios"],["exponent","number indicating a power"],["nom","term or name, as in polynomial"],["flect","bend or turn"],["rotat","turn about a centre"],["dilat","enlarge or reduce by a scale factor"],["later","side (Latin)"],["gon","angle (Greek)"],["quartile","cut point in data divided into fourths"],["correlat","associated or varying in relation"],["simulat","imitate or model"],["dependent","relying on another variable"],["rational","expressible as a ratio of integers with a nonzero denominator"],["preci","price or value"],["budget","plan for income and expenses"],["tax","government-imposed charge"],["inflat","swell or increase"],["round","adjust a number to a nearby place value"],["estim","judge approximately"],["simpl","simple"],["meter","measure (Greek)"],["ration","reason or calculation"],["dict","say or state"],["vari","change or vary"],["percent","amount per hundred"],["slope","measure of rate of change"],["scatter","spread out"],["interest","money earned or paid for using money"],["data","values collected for analysis"],["constant","value that does not change"],["rate","ratio comparing different units"],["income","money received"],["iterat","repeat a step"]]).map(entry=>({...entry,source:'grade9-math'})));

  // MTH1W and prerequisite elementary vocabulary: intentionally selected
  // productive word parts, not arbitrary syllable cuts.
  for(const [id,meaning,tags,exampleWord,formClass] of [["under","below a usual or expected amount",["below"],"underestimate","prefix"],["equi","equal or same",["equal"],"equilateral","initial_combining_form"],["penta","five",["five"],"pentagon","initial_combining_form"],["hexa","six",["six"],"hexagon","initial_combining_form"],["octa","eight",["eight"],"octagon","initial_combining_form"]]){
    prefixes.push({...p(id,meaning,tags),source:'grade9-math',formClass,exampleWord});
  }
  roots.push(...rootsOf('grade9math',[["negative","less than zero"],["divis","divide or separate"],["calcul","count or compute"],["tribut","assign or distribute"],["stitut","put or place"],["valent","having value or worth"],["variate","a variable quantity"],["lead","guide or direct"],["represent","show or stand for something"],["fer","carry or bear (Latin)"],["metr","measure (Greek)"],["invest","put money into something expecting a return"],["pay","give money owed or due"],["charg","charge someone a price or fee"]]).map(entry=>({...entry,source:'grade9-math'})));

  // CGC1W 2024: subject-specific Geography builds on the general Geography bank.
  const grade9GeographyBorrowed=new Set(["graph","scale","therm","log","degrad","culture"]);
  const grade9GeographyBoundRoots=new Set(["locat","climat","meteor","glaci","seism","volcan","eros","posit","divers","cycl","serv","gener","electr","migrat","migr","popul","lingu","commerc","industr"]);
  for(const [id,meaning,tag,exampleWord] of [["carto","maps or mapmaking","map","cartographer"],["topo","place or terrain","place","topographic"],["litho","stone or rock","rock","lithosphere"],["atmo","air or vapour","air","atmosphere"],["cryo","cold or ice","cold","cryosphere"],["demo","people or population","people","demographic"],["agri","field or farming","farming","agriculture"],["im","in or into","inside","immigration"]])prefixes.push({...p(id,meaning,[tag]),source:'grade9-geography',formClass:id==='im'?'prefix':'initial_combining_form',exampleWord});
  for(const [id,meaning,tag,exampleWord] of [["ical","relating to or characteristic of","related","geological"],["ability","capacity or condition of being able to","capacity","sustainability"],["ization","the process of becoming or making","process","urbanization"],["ibility","the quality of being able to","capacity","accessibility"],["ant","a person associated with an action","person","immigrant"]])suffixes.push({...s(id,meaning,[tag]),source:'grade9-geography',formClass:'derivational_suffix',exampleWord});
  roots.push(...rootsOf('grade9geography',[["spatial","relating to space or location"],["locat","place or position"],["tag","attach identifying information"],["reference","align with a known system"],["relation","a connection"],["climat","climate"],["meteor","atmospheric phenomena"],["glaci","ice or glacier"],["seism","earthquake or shaking"],["volcan","volcano"],["eros","wear away"],["posit","put or place"],["sediment","deposited particles"],["divers","varied or different"],["new","new or made new"],["renew","make new again or replenish"],["sustain","maintain or support"],["use","put to a purpose"],["cycl","circle or cycle"],["serv","keep or protect"],["gener","produce or create"],["electr","electricity"],["tourism","travel and visitor activities"],["port","carry or transport"],["migrat","move between places"],["migr","move or migrate"],["popul","people or population"],["lingu","language"],["place","a location"],["develop","grow or improve"],["resident","a person living in a place"],["commerc","trade or business"],["industr","industry or manufacturing"],["access","a means to reach or use"],["afford","have enough resources to pay"],["walk","move on foot"],["live","reside or live"],["connect","link together"],["depend","rely on"]]).map(e=>({...e,source:'grade9-geography'})));
  for(const entry of prefixes){
    entry.role='prefix';
    entry.key='prefix:'+entry.id;
    entry.formClass ||= initialCombining.has(entry.id)?'initial_combining_form':'prefix';
    entry.source ||= 'original-bank';
    entry.reviewNote ||= additions.metadata.reviewFlags.prefix[entry.id]||null;
    entry.exampleWord ||= null;
    entry.creativeEligible=true;
  }
  for(const entry of roots){
    entry.role='base';
    entry.key='base:'+entry.id;
    entry.subjects=entry.subject==='math'&&grade9SharedMathIds.has(entry.id)?['math','grade9math']:[entry.subject];
    if(entry.subject==='geography'||grade9GeographyBorrowed.has(entry.id))entry.subjects.push('grade9geography');
    entry.formClass ||= boundRoots.has(entry.id)||grade9BoundRootIds.has(entry.id)||grade9GeographyBoundRoots.has(entry.id)?'bound_root':'free_base';
    entry.source ||= 'original-bank';
    entry.reviewNote ||= additions.metadata.reviewFlags.base[entry.id]||null;
    entry.creativeEligible=true;
  }
  for(const entry of suffixes){
    entry.role='suffix';
    entry.key='suffix:'+entry.id;
    entry.formClass ||= finalCombining.has(entry.id)?'final_combining_form':'derivational_suffix';
    entry.source ||= 'original-bank';
    entry.reviewNote ||= additions.metadata.reviewFlags.suffix[entry.id]||null;
    entry.exampleWord ||= null;
    entry.creativeEligible=!restrictedCreativeSuffixes.has(entry.id);
  }
  // Important: formClass supports teaching and review; it is NOT a license to
  // combine every pair of cards into a dictionary-standard English word.
  window.MM_MORPHEMES={
    schemaVersion:1,
    bankVersion:'1.3',
    prefixes,roots,suffixes,
    fields:['key','id','text','meaning','role','formClass','tags','subjects','exampleWord','reviewNote','creativeEligible','source'],
    editorialNote:'Word-part labels simplify some linguistic distinctions. Verify full-word spelling and use before treating a construction as a real word.'
  };

})();
