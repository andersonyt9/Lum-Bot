import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { getEmojiString as EMO } from '../utils/emojiSync.js';
const require = createRequire(import.meta.url);

export const data = new SlashCommandBuilder()
  .setName('version')
  .setDescription('Mostra informações detalhadas do Lum-bot e das dependências.');

export async function execute(interaction) {
  try { await interaction.deferReply(); } catch (e) { if (Number(e?.code) === 10062) return; }

  const eIdeia      = EMO(interaction.guild, 'wnIdeia', '💡');
  const eResultados = EMO(interaction.guild, 'wnResultados', '📊');
  const eDocs       = EMO(interaction.guild, 'wnDocs', '📄');
  const eFramework  = EMO(interaction.guild, 'wnFramework', '🧩');
  const eUpdate     = EMO(interaction.guild, 'wnAtualizacoes', '🌐');
  const eClock      = EMO(interaction.guild, 'wnRelogio', '🕒');
  const eAnuncio    = EMO(interaction.guild, 'wnAnuncio', '📢');

  let installed = 'unknown';
  try { installed = require('discord.js/package.json').version; } catch {}
  let latest = null;
  try { latest = execSync('npm view discord.js version', { encoding: 'utf8', timeout: 2000 }).trim(); } catch {}

  const node = process.version;
  const uptime = formatUptime(process.uptime());
  const same = installed !== 'unknown' && latest && installed === latest;

  const embed = new EmbedBuilder()
    .setColor(same ? 0x57F287 : 0x5865F2)
    .setTitle(`${eIdeia} Lum Bot • Informações de Sistema`)
    .setDescription(`${eResultados} Status atual e versões do ambiente`)
    .addFields(
      { name: `${eDocs} Node.js`, value: `\`${node}\``, inline: true },
      { name: `${eFramework} discord.js (instalado)`, value: `\`${installed}\``, inline: true },
      { name: `${eUpdate} discord.js (npm)`, value: `\`${latest ?? 'indisponível'}\``, inline: true },
      { name: `${eClock} Uptime`, value: `\`${uptime}\``, inline: true },
      { name: '💖 Projeto', value: '**Puff Host ❤️**\n✨ Melhorando sua comunidade' }
    )
    .setFooter({ text: 'Lum Bot © Puff Host' })
    .setTimestamp();

  if (!same && latest) {
    embed.addFields({ name: `${eAnuncio} Atualização disponível`, value: 'Use `npm run update:deps` para instalar a última versão do discord.js.' });
  }

  try { await interaction.editReply({ embeds: [embed] }); } catch {}
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const out = [];
  if (d) out.push(`${d}d`);
  if (h) out.push(`${h}h`);
  if (m) out.push(`${m}m`);
  if (!d && !h && !m) out.push(`${s}s`); else if (s) out.push(`${s}s`);
  return out.join(' ');
}