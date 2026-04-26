import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

const envPaths = [
  resolve(__dirname, '../.env'),
  resolve(__dirname, '../.env.local'),
  resolve(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}
