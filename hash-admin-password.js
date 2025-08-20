// hash-admin-password.js
const { randomBytes, scrypt } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const SALT_LENGTH = 32;
  const KEY_LENGTH = 64;
  // ランダムソルト生成
  const salt = randomBytes(SALT_LENGTH);
  // scryptでハッシュ化
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
  // salt:hash 形式で返す
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

(async () => {
  const password = 'Masao314';
  const hash = await hashPassword(password);
  console.log('ハッシュ化されたパスワード:', hash);
})();
