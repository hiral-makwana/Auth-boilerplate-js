import i18n from 'i18n';
import path from 'path';

//const i18n = new I18n()
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

export default i18n