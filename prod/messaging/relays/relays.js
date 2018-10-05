"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_map_1 = require("typescript-map");
const relay_1 = require("./relay");
class Relays {
    constructor(relays) {
        if (relays)
            this.index = relays;
        else
            this.index = new typescript_map_1.TSMap();
    }
    add(relay) {
        this.index.set(relay.id, relay);
    }
    get() {
        return this.index;
    }
    getRelay(id) {
        return this.index.get(id);
    }
    getRelaysWithClientIds(idFrom, idTo) {
        const returnRelays = new Relays();
        this.index.forEach(relay => {
            if (relay.from.id === idFrom && relay.to.id === idTo)
                returnRelays.add(relay);
        });
        return returnRelays;
    }
    set(relays) {
        this.index = relays;
    }
    remove(relay) {
        this.index.delete(relay.id);
    }
    removeClientRelays(client) {
        client.relays.from.forEach(relayId => {
            this.index.delete(relayId);
        });
        client.relays.to.forEach(relayId => {
            this.index.delete(relayId);
        });
    }
    forEach(callback) {
        this.index.forEach((relay) => {
            callback(relay);
        });
    }
    oneToAll(fromClient, toClients) {
        toClients.forEach((toClient) => {
            const relay = new relay_1.default(fromClient, toClient);
            this.add(relay);
        });
    }
    json() {
        return this.index.toJSON();
    }
    toRelays(client) {
        const msgRelays = new Relays();
        client.relays.to.forEach((relayId) => {
            msgRelays.add(this.index.get(relayId));
        });
        return msgRelays;
    }
}
exports.default = Relays;
//# sourceMappingURL=relays.js.map