const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto');


const createToken = (id, role, expiry = '2h') => {
    return jwt.sign({ id, role }, process.env.SECRET_KEY, { expiresIn: expiry });
};

const randString = (length = 10) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

// Image Uploader
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { createToken, upload };
