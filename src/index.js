import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';
import { printRuntimeBanner } from './utils/versionCheck.js';
import onReady from './events/ready.js';
import onInteractionCreate from './events/interactionCreate.js';
import { loadCommands } from './handlers/commandLoader.js';

printRuntimeBanner();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

// novo nome do evento (compat com v14 e prepara v15)
client.once('clientReady', () => onReady(client));
client.on('interactionCreate', (i) => onInteractionCreate(i, client));

(async () => {
  try {
    await loadCommands(client);
    await client.login(ENV.token);
  } catch (err) {
    logger.err('Falha ao iniciar o Lum bot:', err);
    process.exit(1);
  }
})();