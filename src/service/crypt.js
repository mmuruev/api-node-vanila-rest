'use strict';

const crypto = require('crypto');

const ENCRYPTION_KEY = 'secret'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {

 let cipher = crypto.createCipher('aes-256-cbc', new Buffer(ENCRYPTION_KEY));
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);

 return encrypted.toString('hex');
}

function decrypt(text) {
 let textParts = text.split(':');
 let iv = new Buffer(textParts.shift(), 'hex');
 let encryptedText = new Buffer(text, 'hex');
 let decipher = crypto.createDecipher('aes-256-cbc', new Buffer(ENCRYPTION_KEY));
 let decrypted = decipher.update(encryptedText);

 decrypted = Buffer.concat([decrypted, decipher.final()]);

 return decrypted.toString();
}

module.exports = { decrypt, encrypt };