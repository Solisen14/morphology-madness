# Morphology Madness

**Version 1.2 · Expanded Grade 9 morphology bank**

**Play:** https://solisen14.github.io/morphology-madness/

Morphology Madness is a free, browser-based word-building and vocabulary game designed for secondary students and classroom discussion. It uses HTML, CSS, and JavaScript and is hosted on GitHub Pages. It does not require an account or a server.

## Three ways to play

1. **Word Wizard:** Build a genuine word from a factual vocabulary clue. A curated word-part sequence is checked against the intended answer.
2. **Meaning Madness:** Invent a word to fit an unusual definition. The game checks broad word-part meaning tags and lets students explain a creative alternative. Alternatives are **self-reviewed, not automatically graded**.
3. **Word Laboratory:** Spin three wheels to generate a prefix, a root/base, and an ending. Once the wheels stop, students write an imaginative definition and reflect on how the parts contribute meaning. **No automated grading of original definitions.**

Choose Mathematics, **Grade 9 Math (Ontario MTH1W)**, Science, Geography, History, English, or mixed subjects. Sessions contain five rounds. In Word Wizard and Meaning Madness, Apprentice provides **3** cards per word-part group, Inventor **6**, and Master **10**. In Word Laboratory, the levels determine the breadth of the reel vocabulary.

## What's included

- **436** word-part entries: **77** prefixes/initial forms, **298** roots/bases, and **61** suffixes/final forms
- **110** genuine-word challenges and **45** fictional-definition prompts
- Responsive, keyboard-accessible controls and reduced-motion support for spinning reels
- Explanations, hints, self-review, round summaries, and exit confirmation
- No sign-in, analytics, online student submissions, persistent student records, or multiplayer features

## Notes for educators

Morphology provides clues to meaning, but **not every concatenation of cards forms an attested English word**. Greek and Latin combining forms differ from ordinary English prefixes and suffixes; spelling and meaning may change when parts combine. The game's broad semantic tags support discussion rather than establishing the linguistic validity of an invented construction.

Word Wizard checks a curated intended combination rather than grading all potentially defensible alternate words. Meaning Madness and Word Laboratory include student explanation and self-review; they should not be treated as independent assessments of vocabulary mastery.

The current version is intended for educational exploration, with teacher guidance where appropriate. Inspired by the work of Tamara Phillips.

## Repository layout

- `index.html`: page layout and interface text
- `styles.css`: responsive design and animation
- `script.js`: game-state logic, feedback, and interactions
- `morpheme-bank.js`: shared structured bank of word parts
- `data.js`: subject-specific clues and creative prompts
- `tests/validate-data.js`: bank and challenge integrity
- `tests/test-browser.py`: Playwright interaction and mobile checks
- `docs/`: design notes and historical vocabulary review material

## Testing and publishing

GitHub Actions runs bank integrity checks and Chromium browser regressions for all three modes. Pages publishes the `main` branch.

To validate locally:

```bash
node tests/validate-data.js
python tests/test-browser.py
```

The optional browser suite requires Python Playwright and Chromium. It tests game completion, creative alternatives, the three spinning reels, mobile overflow, and exiting mid-game.

See [release notes](RELEASE_NOTES.md) for the v1.0 scope and limitations.

## Grade 9 Math (Ontario MTH1W)

The **Grade 9 Math** option works in all three existing games. It contains **70** Word Wizard clues and **15** Meaning Madness prompts across Number, Algebra and Coding, Data, Geometry and Measurement, and Financial Literacy. The Laboratory wheel draws from **48** dedicated bases plus **48** shared Mathematics roots. The game format, card counts, and privacy rules are unchanged. See [Grade 9 Math educator notes](docs/GRADE9-MATH.md). This is a morphologically focused set, not an exhaustive MTH1W or EQAO-language list.

## Teacher guide (v1.1.1)

An introductory **Teachers: How to Use This Tool** box appears above **Choose your game**. It describes Word Wizard as foundational, Meaning Madness as application, and Word Laboratory as creative explanation and discussion. It is informational only; all three games, subject choices, and assessment rules are unchanged.

## Typography update (v1.1.2)

Adjusted type sizes, line heights and card spacing across the landing page, teacher guide, all three games and results. Important instructional text is now at least 16px, with clearer 17–19px body text and larger clues/headings. At smaller viewport widths, card banks switch to fewer columns to avoid tiny words and cramped card descriptions. Existing colours, game logic, subject choices, difficulty levels, and word bank remain unchanged. Browser regression tests check desktop, tablet and mobile typography and horizontal overflow.

## Grade 9 word-bank expansion (v1.2)

Added 40 original, prerequisite-friendly mathematical terms to Grade 9 Math Word Wizard. All 70 Grade 9 word puzzles now have an automated **minimum-two-meaningful-parts** invariant and exact spelling checks. Existing subject options, Word Laboratory controls, and Meaning Madness prompts are unchanged. See [curriculum and vocabulary editorial notes](docs/GRADE9-MATH.md).
