const jwt = require('jsonwebtoken');
const { config } = require('./constant');
const dotenv = require('dotenv');
dotenv.config();

// Function to generate token
const generateToken = function (user) {
    try {
        let payload = user;
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
        return token;
    } catch (e) {
        console.log(e);
    }
};

module.exports = { generateToken };
