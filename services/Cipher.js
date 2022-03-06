const crypto = require('crypto');
const key = 'corsair#bike$rec@asterisk*scales';
const iv = 'why%fenzuawy^imm';

exports.encrypt = (message) => {
  const cipher = crypto.createCipheriv('aes256', key, iv);
  let encryptedData = cipher.update(message, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

exports.decrypt = (cipher) => {
  const decipher = crypto.createDecipheriv('aes256', key, iv);
  let decryptedData = decipher.update(cipher, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
};
// const shiva = this.encrypt(
//   '?campaign=189758951u298341dnasdcmiu&user=shivaramkrishna.krishna29@gmail.com&success=true'
// );
// console.log('this', shiva);
// console.log(this.decrypt(shiva));
