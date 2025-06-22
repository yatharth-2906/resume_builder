require('dotenv').config();
const crypto = require('crypto'); // Internal Library

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const iterations = Number(process.env.HASH_ITERATIONS); // How many times to run the hash algorithm.
    const keylen = Number(process.env.HASH_KEYLEN); // Length of the output hash in bytes.
    const digest = process.env.HASH_DIGEST; // The hashing algorithm used internally.

    // When you do .toString('hex'), each byte becomes 2 hex characters.
    // So, a 64-byte hash = a 128-character hex string.
    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
    return { salt, hash };
}

function verifyPassword(password, salt, hash) {
    const iterations = Number(process.env.HASH_ITERATIONS); // How many times to run the hash algorithm.
    const keylen = Number(process.env.HASH_KEYLEN); // Length of the output hash in bytes.
    const digest = process.env.HASH_DIGEST; // The hashing algorithm used internally.

    // pbkdf2Sync(...) performs slow hashing using the PBKDF2 algorithm for better security.
    const verifyHash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
    return verifyHash === hash;
}

module.exports = {
    hashPassword,
    verifyPassword
};  