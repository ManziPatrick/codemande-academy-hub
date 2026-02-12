#!/usr/bin/env node

/**
 * Generate runtime environment configuration
 * This script runs at container startup to inject environment variables
 */

const fs = require('fs');
const path = require('path');

const envConfig = {
  VITE_API_URL: process.env.VITE_API_URL || '',
  VITE_WS_URL: process.env.VITE_WS_URL || '',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  VITE_PUSHER_KEY: process.env.VITE_PUSHER_KEY || '',
  VITE_PUSHER_CLUSTER: process.env.VITE_PUSHER_CLUSTER || '',
  VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || '',
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
