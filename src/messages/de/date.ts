const messages = {
    'date.base': '{{#label}} muss ein gültiges Datum sein.',
    'date.format': '{{#label}} muss im Format sein: {msg("date.format." + #format) || #format}',
    'date.greater': '{{#label}} muss größer als {{:#limit}} sein',
    'date.less': '{{#label}} muss kleiner als {{:#limit}} sein',
    'date.max': '{{#label}} muss kleiner oder gleich {{:#limit}} sein',
    'date.min': '{{#label}} muss größer oder gleich {{:#limit}} sein',

    // Messages used in date.format

    'date.format.iso': 'ISO 8601-Datum',
    'date.format.javascript': 'Zeitstempel oder Millisekundenanzahl',
    'date.format.unix': 'Zeitstempel oder Sekundenanzahl',
};

export default messages;
