import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

console.log('CWD:', process.cwd());
console.log('.env path:', path.join(projectRoot, '.env'));
console.log('Has DISCORD_TOKEN:', Boolean(process.env.DISCORD_TOKEN));
console.log('Has CLIENT_ID:', Boolean(process.env.CLIENT_ID));
console.log('Has GUILD_ID:', Boolean(process.env.GUILD_ID));