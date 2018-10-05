"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typescript_map_1 = require("typescript-map");
const clients_1 = require("../../../messaging/clients/clients");
const client_1 = require("../../../messaging/clients/client");
class ClientsTest {
    constructor() {
        describe('Clients Tests', () => {
            it('new Clients() to be an instance of Clients', () => {
                chai_1.expect(new clients_1.default()).to.be.an.instanceof(clients_1.default);
            });
            it('get() returns expected TSMap<number, Client>', () => {
                const expectedIndex = new typescript_map_1.TSMap();
                const clients = new clients_1.default(expectedIndex);
                chai_1.assert.deepEqual(expectedIndex, clients.get());
            });
            it('getClient(id: number) returns correct Client from id number', () => {
                const clients = new clients_1.default();
                const client = new client_1.default();
                clients.add(client);
                const actualClient = clients.getClient(client.id);
                chai_1.assert.deepEqual(actualClient, client);
            });
            it('add(client: Client) adds Client object to Clients index map as expected', () => {
                const clients = new clients_1.default();
                const client = new client_1.default();
                clients.add(client);
                chai_1.assert.deepEqual(client, clients.getClient(client.id));
            });
            it('remove(client: Client) removes Client Object from Clients index as expected', () => {
                const clients = new clients_1.default();
                const expectedClients = new clients_1.default();
                const client = new client_1.default();
                clients.add(client);
                clients.remove(client);
                chai_1.assert.deepEqual(clients, expectedClients);
            });
            it('set(clients: TSMap<number, Client>) sets index of Clients as expected', () => {
                const clients = new clients_1.default();
                const client = new client_1.default();
                const index = new typescript_map_1.TSMap();
                index.set(client.id, client);
                clients.set(index);
                chai_1.assert.deepEqual(clients.index, index);
            });
        });
    }
}
exports.default = ClientsTest;
//# sourceMappingURL=clients.js.map