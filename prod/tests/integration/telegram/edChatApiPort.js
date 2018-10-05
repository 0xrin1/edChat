"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const fs = require("fs");
const chai_1 = require("chai");
const sinon = require("sinon");
const edChat_1 = require("../../../edChat");
const client_1 = require("../../../messaging/clients/client");
const message_1 = require("../../../messaging/router/message");
const relay_1 = require("../../../messaging/relays/relay");
class EdChatApiPortTest {
    constructor() {
        describe('EdChat Test', () => {
            before(done => {
                const chatroomListPath = path.resolve(__dirname, '../', '../', '../', '../', 'chatroomList.json');
                fs.readFile(chatroomListPath, 'utf-8', (err, data) => {
                    if (err)
                        throw err;
                    this.telegramClientNumber = Object.keys(JSON.parse(data)).length;
                    this.edChat = new edChat_1.default(5353, process.env.TELEGRAM_TOKEN, () => {
                        this.greeting = (client, callback) => { };
                        this.greetingSpy = sinon.spy(this.greeting);
                        this.edChat.apiPort.on('greeting', (client, callback) => {
                            this.edChat.clients.add(client);
                            this.greetingSpy();
                            if (this.greetingSpy.callCount === this.telegramClientNumber) {
                                done();
                            }
                            callback();
                        });
                    });
                });
            });
            it('apiPort greetings match number of users in config file', () => {
                chai_1.expect(this.greetingSpy.callCount).equal(this.telegramClientNumber);
            });
            it('commandOut() does not throw error', done => {
                this.edChat.clients.forEach(clientFrom => {
                    this.edChat.clients.forEach(clientTo => {
                        const relay = new relay_1.default(clientFrom, clientTo);
                        this.edChat.relays.add(relay);
                    });
                });
                let counter = 0;
                this.edChat.telegramClients.forEach(client => {
                    this.edChat.apiPort.commandOut(client, new message_1.default('test command out'), () => {
                        if (counter === this.edChat.telegramClients.index.length - 1)
                            done();
                        counter += 1;
                    });
                });
            });
            it('out() does no throw error', done => {
                let counter = 0;
                this.edChat.relays.forEach(relay => {
                    this.edChat.apiPort.out(relay, new message_1.default('test message'), () => {
                        if (counter === this.edChat.relays.index.length - 1)
                            done();
                        counter += 1;
                    });
                });
            });
            it('this.edChat.apiPort.on(\'in\', (client: Client, msg: Message) => void) emmitted and received as expected', done => {
                this.edChat.apiPort.on('in', (client, msg) => {
                    done();
                });
                this.edChat.apiPort.emit('in', new client_1.default(), new message_1.default('bla'));
            });
            it('this.edChat.apiPort.on(\'fetchClientFromId\', (chatId: Client, () => void) emmitted and callback executed as expected', done => {
                let counter = 0;
                let clientId;
                this.edChat.telegramClients.forEach(client => {
                    if (counter === 0)
                        clientId = client.id;
                    counter += 1;
                });
                this.edChat.apiPort.emit('fetchClientFromId', clientId, (client) => {
                    chai_1.assert.equal(client.id, clientId);
                    done();
                });
            });
        });
    }
}
exports.default = EdChatApiPortTest;
//# sourceMappingURL=edChatApiPort.js.map