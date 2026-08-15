import { getLevelData } from './src/game/predefinedLevels.js';
import { solvePuzzle } from './src/game/puzzleSolver.js';

const milestoneLevels = [
  1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 950, 1000
];

console.log('=== VERIFYING MILESTONE LEVELS ACROSS ALL 1,000 TIERS ===\n');

let allPassed = true;

for (const lvl of milestoneLevels) {
  const data = getLevelData(lvl);
  const solution = solvePuzzle(data.arrows, data.boardSize);
  
  const passed = solution.isSolvable && solution.solutionLength === data.arrows.length;
  if (!passed) {
    console.error(`❌ Level ${lvl} FAILED! Solved ${solution.solutionLength}/${data.arrows.length}`);
    allPassed = false;
  } else {
    console.log(`✓ Level ${lvl.toString().padStart(4, ' ')}: ${data.arrows.length.toString().padStart(3, ' ')} arrows on ${data.boardSize}x${data.boardSize.toString().padEnd(2, ' ')} grid | Solved: ${solution.solutionLength}/${data.arrows.length} | Free: ${solution.initialFreeMoves}`);
  }
}

if (allPassed) {
  console.log('\n🎉 ALL CHECKED LEVELS VERIFIED 100% SOLVABLE WITH PERFECT PROGRESSION!');
} else {
  console.error('\n💥 Some levels failed verification.');
}
