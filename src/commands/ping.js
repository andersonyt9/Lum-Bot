import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Retorna Pong! e a latência.');

export async function execute(interaction) {
  const pingButton = new ButtonBuilder()
    .setCustomId('ping_button')
    .setLabel('Ping!')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder()
    .addComponents(pingButton);

  await interaction.reply({
    content: 'Clique no botão para ver a latência!',
    components: [row],
  });
}