import { logger } from '../utils/logger.js';

export default async function onInteractionCreate(interaction, client) {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      try {
        if (!interaction.deferred && !interaction.replied) {
          await interaction.reply({ content: 'Comando não encontrado.', flags: 64 });
        }
      } catch {}
      logger.warn(`Comando não encontrado: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      logger.err('Erro no comando:', err);

      // Se a interação já foi invalidada (10062), não tente responder
      const code = Number(err?.code);
      if (code === 10062) return;

      const msg = 'Ocorreu um erro ao executar este comando.';
      try {
        if (!interaction.deferred && !interaction.replied) {
          await interaction.reply({ content: msg, flags: 64 });
        } else {
          await interaction.followUp({ content: msg, flags: 64 });
        }
      } catch {}
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === 'ping_button') {
      const botLatency = Math.round(Date.now() - interaction.createdTimestamp);
      const websocketLatency = Math.round(client.ws.ping);

      await interaction.update({
        content: `🏓 Pong!\nLatência do bot: \`${botLatency}ms\`\nLatência do WebSocket: \`${websocketLatency}ms\``,
        components: [],
      });
    }
  }
}