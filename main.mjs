// main.mjs

import { spawnScannerManager } from './scannerManager.mjs';
import { generatePairs } from './generatePairs.mjs';
import fs from 'fs/promises';

const liveMode = process.argv.includes('--live');

async function main() {
  try {
    await generatePairs();
    console.log('Generated pairs saved successfully.');
  } catch (err) {
    console.warn('generatePairs failed:', err?.message || err);
    try {
      await fs.stat('./generatedPairs.json');
      console.warn('Continuing with existing generatedPairs.json.');
    } catch {
      console.error('No existing generatedPairs.json found. Exiting.');
      throw err;
    }
  }

  // Wait for file system flush
  await new Promise(resolve => setTimeout(resolve, 500));

  // Start the scanners
  spawnScannerManager(liveMode);
}

main().catch((e) => {
  console.error('Main error:', e?.message || e);
  process.exit(1);
});
