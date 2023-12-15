"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages = {
    'object.and': '{{#label}} contient {{#presentWithLabels}} sans leurs paires nécessaires {{#missingWithLabels}}',
    'object.assert': '{{#label}} n\'est pas valide en raison de {if(#subject.key, `"` + #subject.key + `" a échoué à ` + (#message || "passer le test de validation"), #message || "la validation a échoué")}',
    'object.base': '{{#label}} doit être du type {{#type}}',
    'object.instance': '{{#label}} doit être une instance de {{:#type}}',
    'object.length': '{{#label}} doit avoir {{#limit}} entrée{if(#limit == 1, "", "s")}',
    'object.max': '{{#label}} doit avoir au maximum {{#limit}} entrée{if(#limit == 1, "", "s")}',
    'object.min': '{{#label}} doit avoir au moins {{#limit}} entrée{if(#limit == 1, "", "s")}',
    'object.missing': '{{#label}} doit contenir au moins un parmi {{#peersWithLabels}}',
    'object.nand': '{{:#mainWithLabel}} ne doit pas exister simultanément avec {{#peersWithLabels}}',
    'object.oxor': '{{#label}} contient un conflit entre paires optionnelles exclusives {{#peersWithLabels}}',
    'object.pattern.match': 'Les entrées de {{#label}} n\'ont pas réussi à satisfaire les motifs demandés',
    'object.refType': '{{#label}} doit être une référence de Joi',
    'object.regex': '{{#label}} doit être un objet RegExp',
    'object.rename.multiple': '{{#label}} ne peut pas renommer {{:#from}} car le renommage de plusieurs entrées est désactivé et une autre clé a déjà été renommée en {{:#to}}',
    'object.rename.override': '{{#label}} ne peut pas renommer {{:#from}} car la substitution est désactivée et la cible {{:#to}} existe',
    'object.schema': '{{#label}} doit être un schéma Joi du type {{#type}}',
    'object.unknown': '{{#label}} n\'est pas autorisé',
    'object.with': '{{:#mainWithLabel}} manque la paire obligatoire {{:#peerWithLabel}}',
    'object.without': '{{:#mainWithLabel}} est en conflit avec la paire interdite {{:#peerWithLabel}}',
    'object.xor': '{{#label}} contient un conflit entre paires exclusives {{#peersWithLabels}}',
};
exports.default = messages;
//# sourceMappingURL=keys.js.map