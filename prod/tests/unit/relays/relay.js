"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const relay_1 = require("../../../messaging/relays/relay");
const client_1 = require("../../../messaging/clients/client");
class RelayTest {
    constructor() {
        describe('Relay Tests', () => {
            before(() => {
                this.client = new client_1.default();
                this.client1 = new client_1.default();
            });
            it('new Relay() to be instance of Relay', () => {
                chai_1.expect(new relay_1.default(this.client, this.client1)).to.be.an.instanceof(relay_1.default);
            });
            it('setTo() sets to value to expected client', () => {
                const relay = new relay_1.default(new client_1.default(), new client_1.default());
                relay.setTo(this.client);
                chai_1.assert.deepEqual(relay.to, this.client);
            });
            it('getFrom() returns expected client', () => {
                const relay = new relay_1.default(new client_1.default(), new client_1.default());
                relay.setFrom(this.client);
                chai_1.assert.deepEqual(relay.from, this.client);
            });
            it('getTo() returns expected client', () => {
                const relay = new relay_1.default(this.client, this.client1);
                chai_1.assert.deepEqual(relay.getTo(), this.client1);
            });
            it('constructor() vs setTo() + setFrom()', () => {
                const relay = new relay_1.default(this.client, this.client1);
                const relay1 = new relay_1.default(new client_1.default(), new client_1.default());
                relay1.id = relay.id;
                relay1.setFrom(this.client);
                relay1.setTo(this.client1);
                chai_1.assert.deepEqual(relay, relay1);
            });
        });
    }
}
exports.default = RelayTest;
//# sourceMappingURL=relay.js.map