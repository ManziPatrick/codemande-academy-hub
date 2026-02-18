#!/usr/bin/env node

/**
 * Generate runtime environment configuration
 * This script runs at container startup to inject environment variables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envConfig = {
  VITE_API_URL: process.env.VITE_API_URL || '',
  VITE_WS_URL: process.env.VITE_WS_URL || '',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  VITE_PUSHER_KEY: process.env.VITE_PUSHER_KEY || '',
  VITE_PUSHER_CLUSTER: process.env.VITE_PUSHER_CLUSTER || '',
  VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || '',
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || '',
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || '',
  VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const configContent = `window._env_ = ${JSON.stringify(envConfig, null, 2)};`;

const distPath = path.join(__dirname, 'dist');
const configPath = path.join(distPath, 'env-config.js');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('Error: dist directory not found. Run npm run build first.');
  process.exit(1);
}

// Write the config file
fs.writeFileSync(configPath, configContent);

console.log('✅ Runtime environment configuration generated');
console.log('Environment variables loaded:', Object.keys(envConfig).filter(key => envConfig[key]).length + '/' + Object.keys(envConfig).length);
