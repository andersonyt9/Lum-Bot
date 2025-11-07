import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { logger } from './logger.js';

const require = createRequire(import.meta.url);

function getInstalledDiscordJs() {
  try {
    const entry = require.resolve('discord.js'); // dist/index.js
    let dir = path.dirname(entry);
    for (let i = 0; i < 6; i++) {
      const p = path.join(dir, 'package.json');
      try {
        const pkg = JSON.parse(readFileSync(p, 'utf8'));
        if (pkg?.name === 'discord.js' && pkg?.version) {
          return pkg.version;
        }
      } catch {}
      dir = path.dirname(dir);
    }
  } catch {}
  return 'unknown';
}

function getLatestDiscordJs() {
  try {
    return execSync('npm view discord.js version', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

export function printRuntimeBanner() {
  const node = process.version;
  const installed = getInstalledDiscordJs();
  const latest = getLatestDiscordJs();

  logger.title('Lum-bot • Runtime');
  logger.info('Node.js:', node);
  logger.info('discord.js (instalado):', installed);

  if (latest) {
    logger.info('discord.js (último no npm):', latest);
    if (installed !== 'unknown' && installed !== latest) {
      logger.warn(`Atualização disponível: ${installed} → ${latest}. Rode: npm run update:deps`);
    } else if (installed === latest) {
      logger.ok('Você está na última versão do discord.js.');
    } else {
      logger.warn('Não foi possível comparar versões (installed unknown).');
    }
  } else {
    logger.warn('Não foi possível consultar o npm (offline?).');
  }
}