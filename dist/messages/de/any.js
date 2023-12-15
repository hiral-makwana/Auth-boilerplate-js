"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages = {
    'any.custom': '{{#label}} ist aufgrund von {{#error.message}} bei der Validierung fehlgeschlagen',
    'any.default': '{{#label}} hat einen Fehler bei der Ausführung der Standardmethode verursacht',
    'any.failover': '{{#label}} hat einen Fehler bei der Ausführung der Failover-Methode verursacht',
    'any.invalid': '{{#label}} enthält einen ungültigen Wert',
    'any.only': '{{#label}} muss {if(#valids.length == 1, "", "einer der ")}{{#valids}} sein',
    'any.ref': '{{#label}} {{#arg}} bezieht sich auf {{:#ref}}, der {{#reason}}',
    'any.required': '{{#label}} ist erforderlich',
    'any.unknown': '{{#label}} ist nicht erlaubt',
};
exports.default = messages;
//# sourceMappingURL=any.js.map