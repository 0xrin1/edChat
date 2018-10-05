"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const client_1 = require("../../../messaging/clients/client");
class ClientTest {
    constructor() {
        describe('Client Tests', () => {
            it('new Client() to be an instance of Client', () => {
                chai_1.expect(new client_1.default()).to.be.an.instanceof(client_1.default);
            });
            it('Client constructor is optional ', () => {
                chai_1.assert(new client_1.default());
            });
            it('Client constructor sets given values as expected', () => {
                const greeting = {
                    id: 123,
                    name: 'test name',
                    platform: 'test platform',
                    project: 'test project',
                    date: new Date(),
                };
                const client = new client_1.default(greeting);
                const client1 = new client_1.default();
                client1.id = greeting.id;
                client1.name = greeting.name;
                client1.platform = greeting.platform;
                client1.project = greeting.project;
                client1.date = greeting.date;
                chai_1.assert.deepEqual(client, client1);
            });
            it('Client setTelegram() sets given values as expected', () => {
                const expectedClient = new client_1.default();
                const id = expectedClient.id;
                const name = 'dummy name';
                const platform = 'telegram';
                const project = 'dummy project';
                expectedClient.id = id;
                expectedClient.name = name;
                expectedClient.platform = platform;
                expectedClient.project = project;
                const actualClient = new client_1.default();
                actualClient.setTelegram(id, name, project);
                chai_1.assert.deepEqual(actualClient, expectedClient);
            });
        });
    }
}
exports.default = ClientTest;
//# sourceMappingURL=client.js.map