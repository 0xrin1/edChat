"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chaiExclude = require("chai-exclude");
const relays_1 = require("../../../messaging/relays/relays");
const relay_1 = require("../../../messaging/relays/relay");
const client_1 = require("../../../messaging/clients/client");
const clients_1 = require("../../../messaging/clients/clients");
chai_1.use(chaiExclude);
class RelaysTest {
    constructor() {
        describe('Relays Tests', () => {
            it('new Relays() to be an instance of Relays', () => {
                chai_1.expect(new relays_1.default()).to.be.an.instanceof(relays_1.default);
            });
            it('get() returns Relays.index TSMap<number, Relay>', () => {
                const client = new client_1.default();
                const client1 = new client_1.default();
                const relay = new relay_1.default(client, client1);
                const relays = new relays_1.default();
                relays.add(relay);
                chai_1.assert.deepEqual(relays.get(), relays.index);
            });
            it('getRelay(id: number) returns correct Relay Object from number', () => {
                const client = new client_1.default();
                const client1 = new client_1.default();
                const expectedRelay = new relay_1.default(client, client1);
                const relays = new relays_1.default();
                relays.add(expectedRelay);
                const actualRelay = relays.getRelay(expectedRelay.id);
                chai_1.assert.deepEqual(actualRelay, expectedRelay);
            });
            it('add() followed by getRelay() returns same relay', () => {
                const client = new client_1.default();
                const client1 = new client_1.default();
                const relay = new relay_1.default(client, client1);
                const relays = new relays_1.default();
                relays.add(relay);
                chai_1.assert.deepEqual(relays.getRelay(relay.id), relay);
            });
            it('remove() behaves as expected', () => {
                const client = new client_1.default();
                const client1 = new client_1.default();
                const relay = new relay_1.default(client, client1);
                const relays = new relays_1.default();
                relays.add(relay);
                relays.remove(relay);
                chai_1.assert.equal(relays.index.length, 0);
            });
            it('oneToAll() creates expected relays', () => {
                const fromClient = new client_1.default();
                const toClient = new client_1.default();
                const toClient1 = new client_1.default();
                const toClients = new clients_1.default();
                const expectedRelays = new relays_1.default();
                expectedRelays.add(new relay_1.default(fromClient, toClient));
                expectedRelays.add(new relay_1.default(fromClient, toClient1));
                toClients.add(toClient);
                toClients.add(toClient1);
                const relays = new relays_1.default();
                relays.oneToAll(fromClient, toClients);
                chai_1.assert.deepEqualExcludingEvery(relays, expectedRelays, ['_keys', 'id']);
            });
            it('getRelaysByClientIds() returns expected Relays', () => {
                const clientFrom = new client_1.default();
                const clientTo = new client_1.default();
                const idFrom = clientFrom.id;
                const idTo = clientTo.id;
                const relays = new relays_1.default();
                const expectedRelays = new relays_1.default();
                const relay = new relay_1.default(clientFrom, clientTo);
                const relay1 = new relay_1.default(new client_1.default(), new client_1.default());
                relays.add(relay);
                expectedRelays.add(relay);
                relays.add(relay1);
                relays.add(relay1);
                const actualRelays = relays.getRelaysWithClientIds(idFrom, idTo);
                chai_1.assert.deepEqual(actualRelays, expectedRelays);
            });
            it('toRelays() returns all Relays relevant to Client', () => {
                const relays = new relays_1.default();
                const expectedRelays = new relays_1.default();
                const targetClient = new client_1.default();
                const dummyClient = new client_1.default();
                const dummyClient1 = new client_1.default();
                const targetRelay = new relay_1.default(targetClient, dummyClient);
                const targetRelay1 = new relay_1.default(dummyClient, targetClient);
                const dummyRelay = new relay_1.default(dummyClient, dummyClient1);
                const dummyRelay1 = new relay_1.default(dummyClient1, dummyClient);
                relays.add(targetRelay);
                relays.add(targetRelay1);
                relays.add(dummyRelay);
                relays.add(dummyRelay1);
                expectedRelays.add(targetRelay);
                const actualRelays = relays.toRelays(targetClient);
                chai_1.assert.deepEqual(actualRelays, expectedRelays);
            });
            it('removeClientRelays() removes all Relay Objects affected by client', () => {
                const actualRelays = new relays_1.default();
                const expectedRelays = new relays_1.default();
                const targetClient = new client_1.default();
                const dummyClient = new client_1.default();
                const dummyClient1 = new client_1.default();
                const targetRelay = new relay_1.default(targetClient, dummyClient);
                const targetRelay1 = new relay_1.default(dummyClient, targetClient);
                const dummyRelay = new relay_1.default(dummyClient, dummyClient1);
                const dummyRelay1 = new relay_1.default(dummyClient1, dummyClient);
                actualRelays.add(targetRelay);
                actualRelays.add(targetRelay1);
                actualRelays.add(dummyRelay);
                actualRelays.add(dummyRelay1);
                expectedRelays.add(dummyRelay);
                expectedRelays.add(dummyRelay1);
                actualRelays.removeClientRelays(targetClient);
                chai_1.assert.deepEqual(actualRelays, expectedRelays);
            });
        });
    }
}
exports.default = RelaysTest;
//# sourceMappingURL=relays.js.map