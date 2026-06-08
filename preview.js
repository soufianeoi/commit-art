#!/usr/bin/env node
/**
 * Preview a pattern in the terminal before committing.
 * Shows the 7-row grid using colored blocks representing commit intensity.
 *
 * Usage: node preview.js <pattern.json>
 */

const fs = require('fs');
const path = require('path');

const patternFile = process.argv[2];
if (!patternFile) {
  console.error('Usage: node preview.js <pattern.json>');
  process.exit(1);
}

const pattern = JSON.parse(fs.readFileSync(patternFile, 'utf8'));
const grid = pattern.grid;

if (!grid || grid.length !== 7) {
  console.error('Pattern must have exactly 7 rows');
  process.exit(1);
}

const blocks = [' ', '░', '▒', '▓', '█'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

console.log(`\n  Pattern: ${pattern.name}`);
console.log(`  ${pattern.description}`);
console.log(`  Grid: ${grid[0].length} weeks x 7 days\n`);

for (let r = 0; r < 7; r++) {
  let row = `  ${days[r]} `;
  for (let c = 0; c < grid[r].length; c++) {
    const v = Math.min(Math.max(grid[r][c] || 0, 0), 4);
    row += blocks[v];
  }
  console.log(row);
}

const totalPixels = grid.flat().filter(v => v > 0).length;
const totalCommits = grid.flat().reduce((a, b) => a + b, 0);
console.log(`\n  Filled cells: ${totalPixels}`);
console.log(`  Total commits: ${totalCommits}`);
console.log('');
