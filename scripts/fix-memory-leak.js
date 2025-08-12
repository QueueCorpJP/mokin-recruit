#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Node.js memory issues and SetCppgcReference errors...\n');

const fixes = [
  {
    name: 'Clear npm cache',
    command: 'npm cache clean --force',
  },
  {
    name: 'Remove node_modules',
    command: 'rm -rf node_modules client/node_modules packages/*/node_modules',
  },
  {
    name: 'Remove package-lock files',
    command: 'rm -f package-lock.json client/package-lock.json packages/*/package-lock.json',
  },
  {
    name: 'Clear Next.js cache',
    command: 'rm -rf client/.next client/.turbo',
  },
  {
    name: 'Clear temporary files',
    command: 'rm -rf /tmp/v8-compile-cache-* /tmp/next-*',
  },
];

fixes.forEach(({ name, command }) => {
  try {
    console.log(`⏳ ${name}...`);
    execSync(command, { stdio: 'inherit', shell: true });
    console.log(`✅ ${name} - completed\n`);
  } catch (error) {
    console.log(`⚠️  ${name} - skipped (${error.message})\n`);
  }
});

console.log('📦 Reinstalling dependencies with correct Node version...\n');

try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Memory leak fixes applied successfully!');
console.log('\n📝 Next steps:');
console.log('1. Use Node.js v20.x (run: nvm use 20)');
console.log('2. Start the dev server: npm run dev');
console.log('3. Monitor for errors: tail -f client/logs/*.log');