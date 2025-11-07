import { ActivityType } from 'discord.js';
import { logger } from '../utils/logger.js';

const activities = [
  { name: 'Puff Host ❤️', type: ActivityType.Watching },                 // Assistindo Puff Host ❤️
  { name: '✨ Melhorando sua comunidade', type: ActivityType.Watching }   // Assistindo ✨ Melhorando sua comunidade
];

export default async function onReady(client) {
  logger.ok(`Logado como ${client.user.tag}`);

  // seta a primeira presença
  client.user.setPresence({ activities: [activities[0]], status: 'online' });

  // alterna entre as frases a cada 60s
  let i = 0;
  setInterval(() => {
    i = (i + 1) % activities.length;
    client.user.setPresence({ activities: [activities[i]], status: 'online' });
  }, 60 * 1000);
}