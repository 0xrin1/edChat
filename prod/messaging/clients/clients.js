"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_map_1 = require("typescript-map");
class Clients {
    constructor(clients) {
        if (clients) {
            this.index = clients;
        }
        else {
            this.index = new typescript_map_1.TSMap();
        }
    }
    get() {
        return this.index;
    }
    getClient(id) {
        return this.index.get(id);
    }
    set(clients) {
        this.index = clients;
    }
    add(client) {
        this.index.set(client.id, client);
    }
    remove(client) {
        this.index.delete(client.id);
    }
    forEach(callback) {
        this.index.forEach((client) => {
            callback(client);
        });
    }
}
exports.default = Clients;
//# sourceMappingURL=clients.js.map