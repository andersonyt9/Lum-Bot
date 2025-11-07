import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { REST, Routes, Collection } from 'discord.js';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsDir = path.resolve(__dirname, '..', 'commands');

function toFileImport(p) {
  // Converte "C:\...\file.js" para "file:///C:/.../file.js"
  return pathToFileURL(p).href;
}

export async function loadCommands(client) {
  const files = readdirSync(commandsDir).filter(f => f.endsWith('.js'));
  client.commands = new Collection();

  for (const file of files) {
    const mod = await import(toFileImport(path.join(commandsDir, file)));
    if (mod.data && mod.execute) {
      client.commands.set(mod.data.name, mod);
    }
  }
  return client.commands;
}

async function deployCommands() {
  const files = readdirSync(commandsDir).filter(f => f.endsWith('.js'));
  const commandData = [];

  for (const file of files) {
    const mod = await import(toFileImport(path.join(commandsDir, file)));
    if (mod.data) commandData.push(mod.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(ENV.token);

  logger.title('Registrando slash commands');
  if (ENV.guildId && !ENV.isProd) {
    await rest.put(
      Routes.applicationGuildCommands(ENV.clientId, ENV.guildId),
      { body: commandData }
    );
    logger.ok(`Comandos registrados na guild ${ENV.guildId} (DEV).`);
  } else {
    await rest.put(
      Routes.applicationCommands(ENV.clientId),
      { body: commandData }
    );
    logger.ok('Comandos registrados GLOBALMENTE.');
  }
}

// permite rodar standalone: `npm run deploy:commands`
if (process.argv.includes('--deploy')) {
  (async () => {
    try {
      await deployCommands();
    } catch (e) {
      logger.err(e);
      process.exit(1);
    }
  })();
}