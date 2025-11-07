import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { execSync } from 'node:child_process';
import { getEmojiString as EMO } from '../utils/emojiSync.js';

const BRAND_COLOR = 0x9b5cf7; // roxo

export const data = new SlashCommandBuilder()
  .setName('version')
  .setDescription('Mostra informações detalhadas do Lum-bot e das dependências.');

export async function execute(interaction) {
  try { await interaction.deferReply(); } catch (e) { if (Number(e?.code) === 10062) return; }

  // Emojis (com fallback)
  const eIdeia      = EMO(interaction.guild, 'wnIdeia', '💡');
  const eResultados = EMO(interaction.guild, 'wnResultados', '📊');
  const eDocs       = EMO(interaction.guild, 'wnDocs', '📄');
  const eFramework  = EMO(interaction.guild, 'wnFramework', '🧩');
  const eUpdate     = EMO(interaction.guild, 'wnAtualizacoes', '🌐');
  const eClock      = EMO(interaction.guild, 'wnRelogio', '🕒');
  const eAnuncio    = EMO(interaction.guild, 'wnAnuncio', '📢');
  const eAviso      = EMO(interaction.guild, 'wnAviso', '⚠️');
  const ePergunta   = EMO(interaction.guild, 'wnPergunta', '❓');
  const eNecessario = EMO(interaction.guild, 'necessario', '✅');
  const eAdd        = EMO(interaction.guild, 'maui_add', '🔎');


  // ===== versão instalada do discord.js (robusta) =====
  let installed = 'unknown';
  try {
    const dj = await import('discord.js');
    installed = dj?.version ?? dj?.default?.version ?? 'unknown';
  } catch {}

  if (installed === 'unknown') {
    try {
      const { createRequire } = await import('node:module');
      const { readFileSync } = await import('node:fs');
      const path = await import('node:path');
      const req = createRequire(import.meta.url);
      const entry = req.resolve('discord.js');
      let dir = path.dirname(entry);
      for (let i = 0; i < 6; i++) {
        const p = path.join(dir, 'package.json');
        try {
          const pkg = JSON.parse(readFileSync(p, 'utf8'));
          if (pkg?.name === 'discord.js' && pkg?.version) { installed = pkg.version; break; }
        } catch {}
        dir = path.dirname(dir);
      }
    } catch {}
  }
  // =====================================================

  // versão mais recente (timeout curto p/ não travar)
  let latest = null;
  try {
    latest = execSync('npm view discord.js version', { encoding: 'utf8', timeout: 2000 }).trim();
  } catch {}

  const node = process.version;
  const uptime = formatUptime(process.uptime());
  const upToDate = installed !== 'unknown' && latest && installed === latest;

  // texto do bloco de atualização (sempre exibido)
  let updateText = `${eAviso} Não foi possível consultar o npm agora.`;
  if (latest) {
    if (installed === 'unknown') {
      updateText = `${ePergunta} Não foi possível detectar a versão instalada.\n✨ Use **\`npm run update:deps\`** para instalar a última versão do **discord.js**.`;
    } else if (upToDate) {
      updateText = `${eNecessario} Você já está na última versão (**${latest}**).`;
    } else {
      updateText = `${eAdd} Nova versão disponível (**${latest}** → atual: **${installed}**).\nUse **\`npm run update:deps\`** para atualizar o **discord.js**.`;
    }
  }

  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle(`${eIdeia} Lum Bot • Informações de Sistema`)
    .setDescription(`${eResultados} Status atual e versões do ambiente`)
    .addFields(
      { name: `${eDocs} Node.js`, value: `\`${node}\``, inline: true },
      { name: `${eFramework} discord.js (instalado)`, value: `\`${installed}\``, inline: true },
      { name: `${eUpdate} discord.js (npm)`, value: `\`${latest ?? 'indisponível'}\``, inline: true },
      { name: `${eClock} Uptime`, value: `\`${uptime}\``, inline: true },
      { name: `${eAnuncio} Atualização`, value: updateText },
      { name: '💖 Projeto', value: '**Puff Host ❤️**\n✨ Melhorando sua comunidade' }
    )
    .setFooter({
      text: 'Lum Bot © Puff Host',
      iconURL: interaction.client.user.displayAvatarURL({ size: 128 })
    })
    .setTimestamp();

  try { await interaction.editReply({ embeds: [embed] }); } catch {}
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (!d && !h && !m) parts.push(`${s}s`);
  else if (s) parts.push(`${s}s`);
  return parts.join(' ');
}