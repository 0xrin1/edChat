import { assert, expect } from 'chai';
import { TSMap } from 'typescript-map';

import Clients from '../../../messaging/clients/clients';
import Client from '../../../messaging/clients/client';

export default class ClientsTest {
    constructor() {
        describe('Clients Tests', () => {
            it('new Clients() to be an instance of Clients', () => {
                expect(new Clients()).to.be.an.instanceof(Clients);
            });

            it('get() returns expected TSMap<number, Client>', () => {
                const expectedIndex: TSMap<number, Client> = new TSMap();
                const clients = new Clients(expectedIndex);
                assert.deepEqual(expectedIndex, clients.get());
            });

            it('getClient(id: number) returns correct Client from id number', () => {
                const clients = new Clients();
                const client = new Client();
                clients.add(client);
                const actualClient: Client = clients.getClient(client.id);
                assert.deepEqual(actualClient, client);
            });

            it('add(client: Client) adds Client object to Clients index map as expected', () => {
                const clients: Clients = new Clients();
                const client: Client = new Client();
                clients.add(client);
                assert.deepEqual(client, clients.getClient(client.id));
            });

            it('remove(client: Client) removes Client Object from Clients index as expected', () => {
                const clients: Clients = new Clients();
                const expectedClients: Clients = new Clients();
                const client: Client = new Client();
                clients.add(client);
                clients.remove(client);
                assert.deepEqual(clients, expectedClients);
            });

            it('set(clients: TSMap<number, Client>) sets index of Clients as expected', () => {
                const clients: Clients = new Clients();
                const client: Client = new Client();
                const index: TSMap<number, Client> = new TSMap();
                index.set(client.id, client);
                clients.set(index);
                assert.deepEqual(clients.index, index);
            });
        });
    }
}
