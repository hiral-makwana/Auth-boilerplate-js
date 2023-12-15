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
import frMessagesJSON from '../../locales/fr.json';
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
    ...frMessagesJSON
};

export default fr;
