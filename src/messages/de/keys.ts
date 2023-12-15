const messages = {
    'object.and': '{{#label}} enthält {{#presentWithLabels}} ohne ihre notwendigen Paare {{#missingWithLabels}}',
    'object.assert': '{{#label}} ist ungültig aufgrund von {if(#subject.key, `"` + #subject.key + `" hat das Validierungstest nicht bestanden`, #message || "die Validierung ist fehlgeschlagen")}',
    'object.base': '{{#label}} muss vom Typ {{#type}} sein',
    'object.instance': '{{#label}} muss eine Instanz von {{:#type}} sein',
    'object.length': '{{#label}} muss {{#limit}} Eintrag{if(#limit == 1, "", "e")} haben',
    'object.max': '{{#label}} darf maximal {{#limit}} Eintrag{if(#limit == 1, "", "e")} haben',
    'object.min': '{{#label}} muss mindestens {{#limit}} Eintrag{if(#limit == 1, "", "e")} haben',
    'object.missing': '{{#label}} muss mindestens eine der {{#peersWithLabels}} enthalten',
    'object.nand': '{{:#mainWithLabel}} darf nicht gleichzeitig mit {{#peersWithLabels}} existieren',
    'object.oxor': '{{#label}} enthält einen Konflikt zwischen optionalen exklusiven Paaren {{#peersWithLabels}}',
    'object.pattern.match': '{{#label}}-Eingaben konnten nicht den geforderten Mustern entsprechen',
    'object.refType': '{{#label}} muss eine Joi-Referenz sein',
    'object.regex': '{{#label}} muss ein RegExp-Objekt sein',
    'object.rename.multiple': '{{#label}} kann {{:#from}} nicht umbenennen, da die Umbenennung mehrerer Einträge deaktiviert ist und bereits eine andere Schlüssel in {{:#to}} umbenannt wurde',
    'object.rename.override': '{{#label}} kann {{:#from}} nicht umbenennen, da das Überschreiben deaktiviert ist und das Ziel {{:#to}} bereits existiert',
    'object.schema': '{{#label}} muss ein Joi-Schema vom Typ {{#type}} sein',
    'object.unknown': '{{#label}} ist nicht erlaubt',
    'object.with': '{{:#mainWithLabel}} fehlt das erforderliche Paar {{:#peerWithLabel}}',
    'object.without': '{{:#mainWithLabel}} steht im Konflikt mit dem verbotenen Paar {{:#peerWithLabel}}',
    'object.xor': '{{#label}} enthält einen Konflikt zwischen exklusiven Paaren {{#peersWithLabels}}',
};

export default messages;
