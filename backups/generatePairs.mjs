// generatePairs.mjs
import fs from 'fs/promises';
import path from 'path';

const PAIRS_FILE = path.resolve('./pairs.json');
const PATHS_FILE = path.resolve('./paths.json');
const OUTPUT_FILE = path.resolve('./generatedPairs.json');

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function generatePairs() {
  const pairs = await loadJson(PAIRS_FILE);
  const paths = await loadJson(PATHS_FILE);

  const generatedPairs = pairs.map(pair => {
    // Attach tradePaths from paths.json if available
    const matchingPaths = paths.filter(p => p.name === pair.name).map(p => p.tradePaths).flat();
    return {
      ...pair,
      tradePaths: matchingPaths.length ? matchingPaths : pair.tradePaths || [],
    };
  });

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(generatedPairs, null, 2), 'utf-8');
  console.log(`Generated pairs saved to ${OUTPUT_FILE}`);
  return generatedPairs;
}

// Run script if called directly
if (process.argv[1].endsWith('generatePairs.mjs')) {
  generatePairs().catch(err => {
    console.error('Error generating pairs:', err);
    process.exit(1);
  });
}

export { generatePairs };
