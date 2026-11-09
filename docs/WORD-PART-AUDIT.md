# Word-part quality review, 8 November 2026

## Scope and findings

Full review of the **471 authored real-word Word Wizard targets** in Morphology Madness v1.7, followed by curated revisions in v1.8. Creative Meaning Madness prompts are not a fixed dictionary-word list, and the Word Laboratory creates new combinations; their existing semantic checks remain separate.

| Subject selection | Total | Prefix + base or base + suffix | Prefix + base + suffix |
|---|---:|---:|---:|
| General Vocabulary | 40 | 15 | 25 |
| Grade 9 Math | 70 | 35 | 35 |
| Grade 9 Science | 89 | 63 | 26 |
| Grade 9 Geography | 76 | 34 | 42 |
| Grade 9 English | 99 | 66 | 33 |
| Grade 10 History | 97 | 62 | 35 |
| **All Word Wizard words** | **471** | **275** | **196** |

**Pass:** every answer has a base/root plus at least one other meaningful part; no single-root answers. Every composed spelling matches the intended word, and the target root is selectable in its subject.

**Pedagogical judgement:** `196 / 471 ≈ 41.6%` have all three parts. The aspiration for "most" words to use three parts is **not** met, and should not be manufactured by inventing affixes or substituting misleading roots. Students should learn to decide when two or three parts genuinely make up a word.

## Fourteen reviewed changes

**Grade 9 Math:** `percentage` (`per + cent + age`), `irrational` (`ir + ration + al`), `overestimate` (`over + estim + ate`), `underestimate` (`under + estim + ate`), `nonlinear` (`non + line + ar`), `independent` (`in + depend + ent`), `interquartile` (`inter + quart + ile`).

**Grade 9 Science:** `observation` (`ob + serv + ation`), `decomposer` (`de + compos + er`), `producer` (`pro + duc + er`), `adaptation` (`ad + apt + ation`), `conductor` (`con + duct + or`), `conductivity` (`con + duct + ivity`).

**Grade 10 History:** `constitution` (`con + stitut + ion`).

No words were added or deleted; none of the other **457** word targets were edited. The previous **two-part decomposition of each revised word remains an approved alternative**: Word Wizard accepts either the preferred three-part historical form or the original meaningful two-part form. This avoids marking valid constructions incorrect when students see different roots on their cards. Original generalized and curriculum-specific bank membership was preserved. Meaning Madness's **129** creative prompts were unchanged.

## What we deliberately did not do

- **Consumer** is not `con + sum + -er` in the sense of mathematical *sum*. It comes from a different historical root meaning “take up”. Sharing the maths meaning would mislead.
- **Economic** cannot be meaningfully split as `eco + nom + -ic` using *nom* = a mathematical term or name. The historical Greek parts instead refer to household management.
- **Inference** should not use the existing `in-` = “not”. The *in-* in *infer* has a different historical sense.
- Words such as `semicircle`, `photosynthesis`, `biosphere`, `antonym`, and `exoplanet` have genuinely informative **two-part** structures. They do not need a third invented part.

## Etymological references

- [Percentage](https://www.etymonline.com/word/percentage) and [percent](https://www.etymonline.com/word/percent): modern percentage = percent + -age; historical percent = Latin per centum.
- [Conduct](https://www.etymonline.com/word/conduct): Latin com-/con- + ducere (lead).
- [Observe](https://www.etymonline.com/word/observe): Latin ob- + servare (watch/keep).
- [Produce](https://www.etymonline.com/word/produce): Latin pro- + ducere (lead forth).
- [Adapt](https://www.etymonline.com/word/adapt): Latin ad- + aptare (fit).
- [Quartile](https://www.etymonline.com/word/quartile): from Latin quartus (fourth) through Romance/Medieval Latin forms.
- [Decompose](https://www.etymonline.com/word/decompose): de- + compose.

Note: Some splits are **historical teaching decompositions**, not claims that the elements operate as productive affixes in contemporary English. In particular, the game uses the historical word-beginning `per` of *per centum* to illustrate *percentage*. Spelling checks can prove consistency, not linguistic validity by themselves. Always teach contemporary meanings and subject-specific concepts alongside etymology.

## Regression protections

The Node suite now fails if any future Word Wizard entry lacks a root plus prefix/suffix, has the wrong assembled spelling, or uses a root unavailable to the selected subject. It also validates the approved alternative constructions for all 14 revised terms. All unchanged entries and Meaning Madness prompts have content fingerprints. Browser checks verify the actual three modes and difficulty levels.

Original teachers' notes and five curricula were not rewritten or reinterpreted.
