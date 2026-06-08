<div align="center">
  <img src="https://img.shields.io/badge/status-fun-ff69b4?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-00c8ff?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/node-18%2B-339933?style=for-the-badge&logo=node.js" alt="Node">
</div>

<br>

<div align="center">
  <h1>commit-art</h1>
  <p><em>Draw pixel art on your GitHub contribution graph</em></p>
</div>

---

Turn your contribution graph into a canvas. This script creates backdated empty commits to form pixel art patterns on GitHub's green squares grid.

## How It Works

GitHub's contribution graph is a 7-row grid (Monday–Sunday) with one column per week. Each cell's shade depends on commit count:

| Value | Shade | Commits |
|-------|-------|---------|
| 0 | Blank | 0 |
| 1 | Light | 1–3 |
| 2 | Medium | 4–6 |
| 3 | Dark | 7–9 |
| 4 | Darkest | 10+ |

The script makes empty commits with backdated `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE` to fill in specific cells.

## Usage

```bash
# Clone (must be a new/solo repo — only your commits show)
git clone https://github.com/your-username/commit-art.git
cd commit-art

# Preview a pattern first (no commits made)
node preview.js patterns/heart.json

# Draw a heart on 2025's graph
node draw.js patterns/heart.json 2025

# Push to GitHub
git push origin main

# Done! Check your profile graph.
```

> **Important:** This works best in its own repository. Only commits pushed to `main` (or your default branch) show on the profile graph.

## Patterns

| File | Preview |
|------|---------|
| `patterns/heart.json` | Pixel heart (~12 weeks) |
| `patterns/star.json` | Pixel star (~11 weeks) |
| `patterns/smiley.json` | Smiley face (~15 weeks) |
| `patterns/skull.json` | Pixel skull (~13 weeks) |
| `patterns/arrow.json` | Right arrow (~15 weeks) |
| `patterns/diamond.json` | Diamond (~15 weeks) |
| `patterns/pi.json` | Pi symbol (π, ~14 weeks) |

### Preview a Pattern

See what a pattern looks like before committing:

```bash
node preview.js patterns/heart.json
```

Output:
```
  Pattern: Heart
  Grid: 13 weeks x 7 days

  Mon    ░░██░██░░
  Tue   ░████░████
  Wed   ███████████
  Thu   ████████████
  Fri   ████████████
  Sat   ░█████████░
  Sun   ░░███████░░

  Filled cells: 63
  Total commits: 63
```

### Making Your Own

Patterns are 7×N JSON arrays. Row 0 = Monday, Row 6 = Sunday. Each value 0–4.

```json
{
  "name": "My Art",
  "grid": [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,0,1,1,0,0]
  ]
}
```

Tip: sketch your design on grid paper or use a pixel editor first. N = number of columns (weeks), max ~52 for a full year.

## Undoing

```bash
# Remove the repo (or delete the branch)
# Your contribution graph will update within a few days.
```

---

<div align="center">
  <p><strong>Have fun. Make your graph ugly on purpose.</strong></p>
</div>
