const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'de', 'fr'],
    directory: path.join(__dirname, '../locales'),
    messageDirectories: {
        'en': path.join(__dirname, '../messages/en'),
        'de': path.join(__dirname, '../messages/de'),
        'fr': path.join(__dirname, '../messages/fr')
    },
    header: 'accept-language',
    register: global
});

module.exports = i18n;
