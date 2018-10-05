"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relays_1 = require("./unit/relays/relays");
const relay_1 = require("./unit/relays/relay");
const clients_1 = require("./unit/clients/clients");
const client_1 = require("./unit/clients/client");
const commands_1 = require("./unit/commands/commands");
const apiPort_1 = require("./unit/apiPort");
const edChatApiPort_1 = require("./integration/telegram/edChatApiPort");
describe('Unit Test', () => {
    new apiPort_1.default();
    new relays_1.default();
    new relay_1.default();
    new clients_1.default();
    new client_1.default();
    new commands_1.default();
});
describe('Integration Test', () => {
    new edChatApiPort_1.default();
});
//# sourceMappingURL=test.js.map