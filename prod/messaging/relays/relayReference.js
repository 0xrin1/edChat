"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RelayReference {
    constructor(to, from) {
        this.to = to;
        this.from = from;
    }
    forEach(callback) {
        callback({ to: this.to, from: this.from });
    }
}
exports.default = RelayReference;
//# sourceMappingURL=relayReference.js.map