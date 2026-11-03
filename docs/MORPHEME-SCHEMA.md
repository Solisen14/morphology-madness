# Morpheme bank schema (v0.3 draft)

The bank is defined in `morpheme-bank.js`, loaded before `data.js`,
and shared by all solo modes without a backend.

Each entry preserves the v0.2 gameplay fields:
`id`, `text`, `meaning`; initial/final forms also have `tags`, and
roots/bases retain `subject`.

## New metadata

- `key`: stable namespaced identifier, e.g. `prefix:anti`, `base:fraction`, `suffix:ology`
- `role`: `prefix`, `base`, or `suffix` (card position in the current interface)
- `formClass`: `prefix`, `initial_combining_form`, `free_base`, `bound_root`, `derivational_suffix`, `inflectional_suffix`, or `final_combining_form`
- `subjects`: one-element array for the current subject-specific bases; can be expanded in the future
- `exampleWord`: illustrative authentic word for added prefix and suffix cards; absent on some legacy cards
- `reviewNote`: optional editor caution
- `source`: `original-bank` or `expanded-draft`
- `creativeEligible`: limits misleading standalone inflection cards in invented-word modes
- `tags`: broad instructional meaning labels, not proof of interchangeability

The old `id` is deliberately preserved to keep existing Word Wizard solutions intact.
Do not automatically normalize spelling or infer a new dictionary word from card concatenation.
Proposed future enhancements: editorial status per record, explicit spelling variants,
attested example families, subject reuse across multiple categories, and a compatibility
matrix for common construction patterns.
