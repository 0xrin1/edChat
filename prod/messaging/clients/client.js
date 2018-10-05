"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_1 = require("../../utilities/id");
const relayReference_1 = require("../relays/relayReference");
class Client {
    constructor(greeting) {
        if (!greeting)
            this.new();
        else
            this.set(greeting);
        this.relays = new relayReference_1.default([], []);
    }
    new() {
        const clientId = new id_1.default();
        this.id = clientId.get();
        this.name = 'dummy';
        this.platform = 'dummy';
        this.project = 'dummy';
        this.date = new Date();
    }
    set(greeting) {
        this.id = greeting.id;
        this.name = greeting.name;
        this.platform = greeting.platform;
        this.project = greeting.project;
        this.date = greeting.date;
    }
    setTelegram(id, name, project) {
        this.id = id;
        this.name = name;
        this.platform = 'telegram';
        this.project = project;
        this.custom_keyboard = false;
    }
    setBrowser(ip) {
        this.ip = ip;
        this.custom_keyboard = false;
    }
    setOpenCustomKeyboard() {
        this.custom_keyboard = true;
    }
    setClosedCustomKeyboard() {
        this.custom_keyboard = false;
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map