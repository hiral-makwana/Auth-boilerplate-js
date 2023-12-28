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
const frMessagesJSON = require('../../../locales/fr.json');

const fr = {
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
    ...frMessagesJSON,
};

module.exports = fr;
