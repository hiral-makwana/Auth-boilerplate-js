import alternatives from './alternatives';
import any from './any';
import arrays from './arrays';
import binary from './binary';
import boolean from './boolean';
import date from './date';
import functions from './functions';
import keys from './keys';
import number from './number';
import string from './string';
import symbol from './symbol';
import deMessagesJSON from '../../locales/de.json';
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
    ...deMessagesJSON
};

export default de;
