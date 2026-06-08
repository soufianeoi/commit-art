#!/usr/bin/env node
/**
 * commit-art — Draw pixel art on your GitHub contribution graph
 *
 * Usage:
 *   node draw.js <pattern.json> [year]
 *
 * Example:
 *   node draw.js patterns/heart.json 2025
 *
 * Pattern format:
 *   A JSON file with a 7xN grid (7 rows = Mon-Sun, N columns = weeks).
 *   Each cell value = number of commits (0-4):
 *     0 = blank, 1 = light green, 4 = dark green
 *
 *   "grid": [
 *     [0,0,1,1,0,0,0,1,1,0,0],
 *     [0,1,1,1,1,0,1,1,1,1,0],
 *     ...
 *   ]
 *
 * How it works:
 *   GitHub's contribution graph shows Mon-Sun rows and week columns.
 *   This script makes empty commits on specific past dates using
 *   GIT_AUTHOR_DATE and GIT_COMMITTER_DATE to backdate them.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const patternFile = process.argv[2];
const year = parseInt(process.argv[3]) || new Date().getFullYear();

if (!patternFile) {
  console.error('Usage: node draw.js <pattern.json> [year]');
  console.error('Example: node draw.js patterns/heart.json 2025');
  process.exit(1);
}

const pattern = JSON.parse(fs.readFileSync(patternFile, 'utf8'));
const grid = pattern.grid;

if (!grid || !Array.isArray(grid) || grid.length !== 7) {
  console.error('Pattern must have exactly 7 rows (Mon-Sun)');
  process.exit(1);
}

// Find the first Sunday on or before Jan 1 of the target year
function getStartOfGraph(year) {
  const d = new Date(year, 0, 1);
  while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
  return d;
}

const startDate = getStartOfGraph(year);
const weekWidth = grid[0].length;
let totalCommits = 0;

console.log(`Drawing pattern on ${year} contribution graph...`);
console.log(`Grid: 7 rows x ${weekWidth} columns`);
console.log(`Start date: ${startDate.toISOString().split('T')[0]}\n`);

for (let col = 0; col < weekWidth; col++) {
  for (let row = 0; row < 7; row++) {
    const count = grid[row][col];
    if (!count || count < 1) continue;

    // Calculate the date for this cell
    const cellDate = new Date(startDate);
    cellDate.setDate(cellDate.getDate() + col * 7 + row);

    // Skip future dates
    if (cellDate > new Date()) continue;

    const dateStr = cellDate.toISOString().split('T')[0];

    for (let i = 0; i < count; i++) {
      try {
        execSync(
          `git commit --allow-empty --allow-empty-message -m "" --date="${dateStr}T12:00:00"`,
          { env: { ...process.env, GIT_AUTHOR_DATE: `${dateStr}T12:00:00`, GIT_COMMITTER_DATE: `${dateStr}T12:00:00` }, stdio: 'pipe' }
        );
        totalCommits++;
      } catch (e) {
        // Ignore per-commit errors
      }
    }
  }

  // Show progress
  const pct = ((col + 1) / weekWidth * 100).toFixed(0);
  process.stdout.write(`\r  Progress: ${pct}% (week ${col + 1}/${weekWidth})`);
}

console.log(`\n\nDone! Created ${totalCommits} commits.`);
console.log('Now run: git push origin main');
