const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

// Function to generate token
const generateToken = function (user) {
    try {
        let payload = user;
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION_TIME });
        return token;
    } catch (e) {
        console.log(e);
    }
};

module.exports = { generateToken };
