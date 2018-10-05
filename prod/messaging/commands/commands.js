"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const typescript_map_1 = require("typescript-map");
const message_1 = require("../router/message");
const keyboard_1 = require("./keyboard");
class Commands extends events.EventEmitter {
    constructor() {
        super();
        this.index = new typescript_map_1.TSMap();
        this.index.set('r', this.setRelay);
        this.index.set('u', this.unsetRelay);
    }
    execute(client, name, param, callback) {
        if (this.index.has(name)) {
            const execution = this.index.get(name);
            execution(this, client, param, (response) => {
                callback(response);
            });
        }
    }
    initialize(client, command, clients, callback) {
        if (this.index.has(command)) {
            const clientArray = [];
            clients.forEach(client => {
                clientArray.push(client);
            });
            callback(new keyboard_1.default(clientArray));
        }
    }
    setRelay(commandContext, client, param, callback) {
        commandContext.emit('setRelay', client, parseInt(param[0]), () => {
            callback(new message_1.default(`Relay created to client ${param[0]}`));
        });
    }
    unsetRelay(commandContext, client, id, callback) {
        commandContext.emit('unsetRelay', client, id, () => {
            callback(new message_1.default(`Relay removed`));
        });
    }
}
exports.default = Commands;
//# sourceMappingURL=commands.js.map