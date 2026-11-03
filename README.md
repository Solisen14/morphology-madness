# Morphology Madness

**v0.4.2 · Editorial copy and attribution**

Morphology Madness is a free, static, browser-based vocabulary and word-invention game for secondary students. It runs entirely in HTML, CSS and JavaScript, making it suitable for GitHub Pages and most classroom Chromebooks.

## Play modes

1. **Word Wizard:** Assemble an *existing* word from a subject-specific definition. Correct answers are checked against a curated set of morpheme sequences; some words need only two pieces.
2. **Meaning Madness:** Assemble a plausible invented word for a deliberately strange definition. The game recognizes several prefix and ending meanings for a prompt. Students can also defend a non-matching invention, but that alternative is **self-reviewed, not automatically judged correct**.
3. **Word Laboratory:** A teacher (or a student on the same device) presses **Spin the word wheels**. Three animated reels stop in order at a prefix, subject-specific root, and ending. The definition field appears after the final wheel stops. Students invent a meaning and complete a two-question self-review. There is **no automatic assessment of the invented definition**.

All modes use the same morpheme bank and support Mathematics, Science, Geography, History, English, or a mixed selection, plus Apprentice, Inventor and Master levels. In Word Laboratory the difficulty changes the breadth of the reel vocabulary, not the number of cards.

## Current content

- **40** curated real-word challenges across five subjects
- **30** fictional-definition prompts (6 per subject)
- **70** prefixes/initial combining forms, **250** roots/bases, and **60** suffixes/final combining forms (**380** entries)
- Five rounds per session, a sticky **Exit to game menu** control and a second exit action near the round buttons, a confirmation before discarding progress, keyboard-accessible controls, responsive layouts and a session-only summary
- No accounts, analytics, AI calls, external assets, or persistent storage

## Files

- `index.html`: accessible layout and interactive controls
- `styles.css`: responsive interface
- `morpheme-bank.js`: structured, reusable word-part bank with descriptions and editorial metadata
- `data.js`: subject vocabulary, real-word puzzles and creative prompts
- `script.js`: game state, cards, feedback, self-review and round progression
- `tests/validate-data.js`: ensures every real word can be assembled from its listed parts and checks prompt metadata
- `tests/test-browser.py`: optional browser interaction checks using Python Playwright + Chromium

## Editing the bank

Modify `morpheme-bank.js` for word parts; modify `data.js` for puzzles. Each prefix and ending has a `tags` array of broad meaning categories (such as `small`, `against`, `related`, `study`). Meaning Madness checks those broad categories plus the specified root. These tags are **instructional approximations**, not evidence that any two morphemes are linguistically interchangeable. Real-word puzzles have exact constituent IDs and a human-readable explanation. Keep each subject at five or more playable puzzles per fixed-subject mode.

Run `node tests/validate-data.js` after editing the data. For automated browser QA (when Playwright and Chromium are installed), run `python tests/test-browser.py`.

### Important language notes

- *Morpheme* means the smallest meaningful element; *base* and *root* have related but distinct linguistic meanings.
- Some endings in this prototype (such as **-ology** and **-meter**) are Greek or Latin combining forms rather than ordinary English suffixes.
- The builder concatenates the written segments directly. The game does not attempt spelling transformations, pronunciation changes, or dictionary lookup.
- Creative mode does not give authoritative correctness judgments. Discuss the coherence of morpheme combinations and exceptions with students.
- Classroom definitions and segmented words should be reviewed by educators before high-stakes use.

## Publish with GitHub Pages

GitHub repository **Settings → Pages → Deploy from a branch → main / (root)**. The static site requires no build step and does not need a server-side backend.

## Future ideas (not implemented)

Teacher-authored prompt packs, multi-solution rubrics, evidence-based teacher review of inventions, progress export that respects student privacy, and teacher-guided multiplayer. The current version contains **no multiplayer** or student account system.
## v0.3 expansion, review before merging

The 179 new entries are a draft intended for educator review. Word Wizard remains
at 40 curated answers, and Meaning Madness retains 30 prompts. The additional
entries expand creative possibilities, but do not automatically create new valid
real-word challenges. The original word-part IDs and answer sequences remain intact.

The new schema adds `key`, `role`, `formClass`, `subjects` (roots),
`exampleWord` (new affixes), `source`, `creativeEligible`, and
`reviewNote`. Full-word bases are distinguished from bound roots,
and combining forms are distinguished from ordinary prefixes/suffixes when
reasonably identifiable. These labels still need final linguistic review.

Read `docs/BANK-REVIEW.md` and `docs/MORPHEME-SCHEMA.md` before approving this branch.

## Automated quality checks

GitHub Actions runs `node tests/validate-data.js` and the Playwright browser regression suite on pull requests and changes to `main`. The browser checks cover Word Wizard, Meaning Madness, sequential Word Laboratory reels, definition gating, reduced-motion behaviour, mobile overflow, and exiting a game. Development requires no accounts or student data collection.

### Word Laboratory reel behaviour

The teacher can operate the **Spin** button on a projected device, but the site does not synchronize other devices or store class responses. Prefix, root, and ending animate simultaneously and then stop sequentially (about 1.05, 1.75, and 2.45 seconds); reduced-motion users receive brief non-animated reveals. Student writing is unlocked only after all three reels stop. Spinning again explicitly clears the existing draft after browser confirmation; leaving mid-spin cancels outstanding timers. A surprising combination need not be a dictionary word, and the definition is self-reviewed rather than automatically marked correct.

## v0.4.1 card counts and clue selection

In **Word Wizard** and **Meaning Madness**, Apprentice displays **3** cards per word-part group (9 total), Inventor **6** per group (18 total), and Master **10** per group (30 total). Intended factual answers and tagged creative options are included. Card order and the five-clue selection are randomized at each new game; the clue pools remain fixed at 40 real-word challenges (8 per subject) and 30 imaginary definitions (6 per subject), so repeats across games are expected. Word Laboratory retains its familiar/expanded/full vocabulary pool progression.

## v0.4.2 copy update

Word Laboratory's mode card now says **Spin and define.** and describes spinning the wheels before inventing a definition. The lab prompt uses **A random word is coming. What could it mean?** The home page's prefix teaching example consistently uses **pre-**, and the footer credits **Tamara Phillips** as inspiration. No scoring, selection, or game-state behaviour changed.
