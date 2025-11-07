import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const data = new SlashCommandBuilder()
  .setName('version')
  .setDescription('Mostra informações detalhadas do Lum-bot e das dependências.');

export async function execute(interaction) {
  // 1) tenta segurar a interação imediatamente
  try {
    // nada de ephemeral aqui; só segura o slot
    await interaction.deferReply();
  } catch (e) {
    // Se já estiver inválida (10062), não tente responder de novo
    if (Number(e?.code) === 10062) return;
    // outros erros: só loga e sai
    console.error('deferReply falhou:', e);
    return;
  }

  // 2) coleta versões (com timeout curto pra não travar)
  let installed = 'unknown';
  try { installed = require('discord.js/package.json').version; } catch {}

  let latest = null;
  try {
    latest = execSync('npm view discord.js version', { encoding: 'utf8', timeout: 2000 }).trim();
  } catch {
    latest = null;
  }

  const node = process.version;
  const uptime = formatUptime(process.uptime());
  const same = installed !== 'unknown' && latest && installed === latest;

  const embed = new EmbedBuilder()
    .setColor(same ? 0x57F287 : 0x5865F2)
    .setTitle('<:wnIdeia:1296163637597179994> Lum Bot • Informações de Sistema')
    .setDescription('<:wnResultados:1296172666780389577> Status atual e versões do ambiente')
    .addFields(
      { name: '<:wnDocs:1187427670397554779> Node.js', value: `\`${node}\``, inline: true },
      { name: '<:wnFramework:1253845902318243883> discord.js (instalado)', value: `\`${installed}\``, inline: true },
      { name: '<:wnAtualizacoes:1254608904479047691> discord.js (npm)', value: `\`${latest ?? 'indisponível'}\``, inline: true },
      { name: '<:wnRelogio:1254609198910537871> Uptime', value: `\`${uptime}\``, inline: true },
      { name: '💖 Projeto', value: '**Puff Host ❤️**\n✨ Melhorando sua comunidade' }
    )
    .setFooter({ text: 'Lum Bot © Puff Host' })
    .setTimestamp();

  if (!same && latest) {
    embed.addFields({
      name: '<:wnAnuncio:1187427667956482131> Atualização disponível',
      value: 'Use `npm run update:deps` para instalar a última versão do discord.js.'
    });
  }

  // 3) tenta editar a resposta; se a interação “sumiu”, apenas ignore
  try {
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (Number(e?.code) === 10062) return;
    console.error('editReply falhou:', e);
  }
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