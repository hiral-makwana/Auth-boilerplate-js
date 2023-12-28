const alternatives = require('./alternatives');
const any = require('./any');
const arrays = require('./arrays');
const binary = require('./binary');
const boolean = require('./boolean');
const date = require('./date');
const functions = require('./functions');
const keys = require('./keys');
const number = require('./number');
const string = require('./string');
const symbol = require('./symbol');
const deMessagesJSON = require('../../../locales/de.json');

const de = {
    ...alternatives,
    ...any,
    ...arrays,
    ...binary,
    ...boolean,
    ...date,
    ...functions,
    ...keys,
    ...number,
    ...string,
    ...symbol,
    ...deMessagesJSON,
};

module.exports = de;
