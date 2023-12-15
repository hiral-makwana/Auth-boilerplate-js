const messages = {
    'any.custom': '{{#label}} a échoué lors de la validation en raison de {{#error.message}}',
    'any.default': '{{#label}} a généré une erreur lors de l\'exécution de la méthode par défaut',
    'any.failover': '{{#label}} a généré une erreur lors de l\'exécution de la méthode failover',
    'any.invalid': '{{#label}} contient une valeur invalide',
    'any.only': '{{#label}} doit être {if(#valids.length == 1, "", "l\'un des ")}{{#valids}}',
    'any.ref': '{{#label}} {{#arg}} référence {{:#ref}} qui {{#reason}}',
    'any.required': '{{#label}} est obligatoire',
    'any.unknown': '{{#label}} n\'est pas autorisé',
};

export default messages;
