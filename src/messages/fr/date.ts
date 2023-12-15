const messages = {
    'date.base': '{{#label}} doit être une date valide.',
    'date.format': '{{#label}} doit être au format : {msg("date.format." + #format) || #format}',
    'date.greater': '{{#label}} doit être supérieur à {{:#limit}}',
    'date.less': '{{#label}} doit être inférieur à {{:#limit}}',
    'date.max': '{{#label}} doit être inférieur ou égal à {{:#limit}}',
    'date.min': '{{#label}} doit être supérieur ou égal à {{:#limit}}',

    // Messages used in date.format

    'date.format.iso': 'date ISO 8601',
    'date.format.javascript': 'horodatage ou nombre de millisecondes',
    'date.format.unix': 'horodatage ou nombre de secondes',
};

export default messages;

