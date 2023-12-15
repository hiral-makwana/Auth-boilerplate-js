const messages = {
    'array.base': '{{#label}} muss ein Array sein',
    'array.excludes': '{{#label}} enthält einen ausgeschlossenen Wert',
    'array.hasKnown': '{{#label}} enthält kein erforderliches Muster für den Typ {:#patternLabel}',
    'array.hasUnknown': '{{#label}} enthält kein erforderliches Muster',
    'array.includes': '{{#label}} ist nicht mit einem der erlaubten Typen kompatibel',
    'array.includesRequiredBoth': '{{#label}} enthält weder {{#knownMisses}} noch andere(s) erforderliche(s) Wert(e) {{#unknownMisses}}',
    'array.includesRequiredKnowns': '{{#label}} enthält nicht {{#knownMisses}}',
    'array.includesRequiredUnknowns': '{{#label}} enthält nicht den/die erforderlichen Wert(e) {{#unknownMisses}}',
    'array.length': '{{#label}} muss {{#limit}} Elemente enthalten',
    'array.max': '{{#label}} darf maximal {{#limit}} Elemente enthalten',
    'array.min': '{{#label}} muss mindestens {{#limit}} Elemente enthalten',
    'array.orderedLength': '{{#label}} muss mindestens {{#limit}} Elemente enthalten',
    'array.sort': '{{#label}} muss in {#order} nach {#by} sortiert sein',
    'array.sort.mismatching': '{{#label}} kann aufgrund inkompatibler Typen nicht sortiert werden',
    'array.sort.unsupported': '{{#label}} kann aufgrund des nicht unterstützten Typs {#type} nicht sortiert werden',
    'array.sparse': '{{#label}} darf kein undefiniertes Element sein',
    'array.unique': '{{#label}} enthält ein doppeltes Element',
};

export default messages;
