const { execSync } = require('child_process');
const semver = require('semver');
const { engines } = require('../package.json');

const currentNodeVersion = process.version;
const requiredNodeVersion = engines.node;

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
  console.error(
    `\n⚠️  Node.js version mismatch!\n` +
    `   Current: ${currentNodeVersion}\n` +
    `   Required: ${requiredNodeVersion}\n` +
    `   Please use Node.js v20.x to avoid SetCppgcReference errors.\n` +
    `   Recommended: Use nvm to switch versions (nvm use 20)\n`
  );
  process.exit(1);
}

console.log(`✅ Node.js version ${currentNodeVersion} is compatible`);