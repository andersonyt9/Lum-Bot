import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

// Resolve a raiz do projeto (…/Lum-Bot)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

// Carrega .env explicitamente da raiz
dotenv.config({ path: path.join(projectRoot, '.env') });

function required(name) {
  const v = process.env[name];
  if (!v) {
    const hint = [
      `Variável de ambiente ausente: ${name}`,
      `> Verifique se o arquivo .env existe em: ${path.join(projectRoot, '.env')}`,
      `> Confirme que o nome é ".env" (sem .txt) e está em UTF-8.`,
      `> Rode: npm run env:print para diagnosticar.`
    ].join('\n');
    throw new Error(hint);
  }
  return v;
}

export const ENV = {
  token: required('DISCORD_TOKEN'),
  clientId: required('CLIENT_ID'),
  guildId: process.env.GUILD_ID || null,
  isProd: process.env.NODE_ENV === 'production'
};