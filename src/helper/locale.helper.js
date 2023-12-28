const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'de', 'fr'],
    directory: path.join(__dirname, '../locales'),
    messageDirectories: {
        'en': path.join(__dirname, '../validator/messages/en'),
        'de': path.join(__dirname, '../validator/messages/de'),
        'fr': path.join(__dirname, '../validator/messages/fr')
    },
    header: 'accept-language',
    register: global
});

module.exports = i18n;
