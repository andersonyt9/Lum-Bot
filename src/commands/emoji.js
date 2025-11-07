import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { ensureEmojisInGuild } from '../utils/emojiSync.js';

export const data = new SlashCommandBuilder()
  .setName('emoji')
  .setDescription('Gerencia emojis do Lum-bot')
  .addSubcommand(sc =>
    sc.setName('sync').setDescription('Clona/atualiza os emojis configurados para esta guild')
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  if (!interaction.guild) {
    return interaction.reply({ content: 'Use este comando em uma guild.', flags: 64 });
  }

  const sub = interaction.options.getSubcommand();
  if (sub !== 'sync') return interaction.reply({ content: 'Subcomando inválido.', flags: 64 });

  await interaction.deferReply({ flags: 64 });

  try {
    const { created, skipped, total } = await ensureEmojisInGuild(interaction.guild);
    await interaction.editReply(
      [
        `✅ **Sync de emojis concluída** nesta guild.`,
        `• Total configurados: **${total}**`,
        `• Criados agora: **${created.length}** ${created.length ? `(${created.join(', ')})` : ''}`,
        `• Já existiam / pulados: **${skipped.length}** ${skipped.length ? `(${skipped.join(', ')})` : ''}`
      ].join('\n')
    );
  } catch (e) {
    await interaction.editReply(`❌ Falha ao sincronizar emojis: \`${e.message}\``);
  }
}