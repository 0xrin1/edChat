"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_1 = require("../../utilities/id");
class Relay {
    constructor(from, to) {
        this.id = new id_1.default().get();
        this.setFrom(from);
        this.setTo(to);
        this.setClientRelays();
    }
    setTo(to) {
        this.to = to;
    }
    setFrom(from) {
        this.from = from;
    }
    setClientRelays() {
        this.from.relays.to.push(this.id);
        this.to.relays.from.push(this.id);
    }
    getTo() {
        return this.to;
    }
    getFrom() {
        return this.from;
    }
}
exports.default = Relay;
//# sourceMappingURL=relay.js.map