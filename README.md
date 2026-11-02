# Morphology Madness

A prototype word-building game for secondary students. Players combine **prefix**, **base/root**, and **suffix** cards to match subject-specific definitions.

## Play

Open `index.html` in a browser. Choose Mathematics, Science, Geography, History, English, or a mix. Select one card for each slot, then press **Check my word**. Hints and feedback are included.

## Hosting on GitHub Pages

Upload `index.html`, `styles.css`, and `script.js` to the repository root. In **Settings → Pages**, choose **Deploy from a branch → main → /(root)**, then save.

The website will appear at `https://YOUR-USERNAME.github.io/morphology-madness/` once GitHub finishes publishing.

## Prototype limitations

- Content is a small, hand-curated set of 15 challenges across five subjects, not a full curriculum-aligned vocabulary bank.
- The game checks one intended three-part construction per clue. Other valid formations are not automatically evaluated.
- Some cards are classical combining forms, and definitions are simplified for classroom discussion. Review the linguistic and subject-matter accuracy with educators before widespread use.
- Student responses, scores and names are **not stored** or transmitted. There is no multiplayer, account system, teacher dashboard or analytics.
- Current rounds are client-side only. Intended for prototyping, not high-stakes assessment.

## Next steps

1. Review and expand curated word banks with teachers.
2. Add support for two-part words and more realistic spelling changes.
3. Add pedagogically useful feedback, hints, word-part explanations and accessibility testing.
4. Later, design teacher-guided multiplayer using appropriate authentication and a privacy-reviewed backend. GitHub Pages alone cannot synchronize players.