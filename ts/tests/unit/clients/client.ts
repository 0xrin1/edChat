import { assert, expect } from 'chai';

import Client from '../../../messaging/clients/client';
import Greeting from '../../../messaging/clients/greeting';
import RelayReference from '../../../messaging/relays/relayReference';

export default class ClientTest {
    constructor() {
        describe('Client Tests', () => {
            it('new Client() to be an instance of Client', () => {
                expect(new Client()).to.be.an.instanceof(Client);
            });

            it('Client constructor is optional ', () => {
                assert(new Client());
            });

            it('Client constructor sets given values as expected', () => {
                const greeting: Greeting = {
                    id: 123,
                    name: 'test name',
                    platform: 'test platform',
                    project: 'test project',
                    date: new Date(),
                };
                const client: Client = new Client(greeting);
                const client1: Client = new Client();
                client1.id = greeting.id;
                client1.name = greeting.name;
                client1.platform = greeting.platform;
                client1.project = greeting.project;
                client1.date = greeting.date;
                assert.deepEqual(client, client1);
            });

            it('Client setTelegram() sets given values as expected', () => {
                const expectedClient: Client = new Client();
                // set id the same or the test will never pass
                const id = expectedClient.id;
                const name = 'dummy name';
                const platform = 'telegram';
                const project = 'dummy project';
                // set id the same or the test will never pass
                expectedClient.id = id;
                expectedClient.name = name;
                expectedClient.platform = platform;
                expectedClient.project = project;
                const actualClient: Client = new Client();
                // set id the same or the test will never pass
                actualClient.setTelegram(id, name, project);
                assert.deepEqual(actualClient, expectedClient);
            });
        });
    }
}
