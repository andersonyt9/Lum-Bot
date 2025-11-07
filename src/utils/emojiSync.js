import { EMOJI_SOURCES } from '../config/emojis.js';

export async function ensureEmojisInGuild(guild) {
  if (!guild) throw new Error('ensureEmojisInGuild: guild inválida');

  const existing = await guild.emojis.fetch(); // cache fresquinho
  const created = [];
  const skipped = [];

  for (const [name, url] of Object.entries(EMOJI_SOURCES)) {
    const already = existing.find(e => e.name === name);
    if (already) {
      skipped.push(name);
      continue;
    }

    try {
      // Node 18+ tem fetch global
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Se o link terminar com .gif, vai criar animado (se permitido)
      const emoji = await guild.emojis.create({ attachment: buffer, name });
      created.push(emoji.name);
    } catch (err) {
      // não quebra a sync por 1 emoji
      skipped.push(`${name} (falha: ${err.message})`);
    }
  }

  return { created, skipped, total: Object.keys(EMOJI_SOURCES).length };
}

// helper para usar nos seus comandos: devolve o custom, senão fallback unicode
export function getEmojiString(guild, name, fallback = '✨') {
  const emoji = guild?.emojis?.cache?.find(e => e.name === name);
  return emoji ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : fallback;
}