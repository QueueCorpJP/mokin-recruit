// bcrypt-hash.js
const bcrypt = require('bcrypt');
const password = 'mokinAdmin2024!';
const saltRounds = 12; // 例: $2b$12$... の「12」に合わせる

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) throw err;
  console.log('ハッシュ値:', hash);
});
