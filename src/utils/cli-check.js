import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

(function main() {
  let installed = 'unknown';
  try { installed = require('discord.js/package.json').version; } catch {}

  let latest = null;
  try { latest = execSync('npm view discord.js version', { encoding: 'utf8' }).trim(); } catch {}

  console.log('discord.js -> installed:', installed, '| latest:', latest ?? 'unavailable');
  if (latest && installed !== 'unknown' && installed !== latest) {
    console.log('\n⚠️  Há uma versão mais nova de discord.js.');
    console.log('   Atualize com: npm run update:deps\n');
  }
})();