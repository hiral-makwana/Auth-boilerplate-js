"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages = {
    'array.base': '{{#label}} doit être un tableau',
    'array.excludes': '{{#label}} contient une valeur exclue',
    'array.hasKnown': '{{#label}} ne contient aucun motif requis pour le type {:#patternLabel}',
    'array.hasUnknown': '{{#label}} ne contient aucun motif requis',
    'array.includes': '{{#label}} n\'est pas compatible avec l\'un des types autorisés',
    'array.includesRequiredBoth': '{{#label}} ne contient ni {{#knownMisses}} ni d\'autre(s) valeur(s) {{#unknownMisses}} obligatoire(s)',
    'array.includesRequiredKnowns': '{{#label}} ne contient pas {{#knownMisses}}',
    'array.includesRequiredUnknowns': '{{#label}} ne contient pas la/les valeur(s) {{#unknownMisses}} obligatoire(s)',
    'array.length': '{{#label}} doit contenir {{#limit}} éléments',
    'array.max': '{{#label}} doit contenir au maximum {{#limit}} éléments',
    'array.min': '{{#label}} doit contenir au moins {{#limit}} éléments',
    'array.orderedLength': '{{#label}} doit contenir au moins {{#limit}} éléments',
    'array.sort': '{{#label}} doit être trié en {#order} par {#by}',
    'array.sort.mismatching': '{{#label}} ne peut pas être trié en raison de types incompatibles',
    'array.sort.unsupported': '{{#label}} ne peut pas être trié en raison du type non pris en charge : {#type}',
    'array.sparse': '{{#label}} ne doit pas être un élément non défini',
    'array.unique': '{{#label}} contient un élément en double',
};
exports.default = messages;
//# sourceMappingURL=arrays.js.map