import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import * as fs from 'fs';
import { assert, expect } from 'chai';
import *  as sinon from 'sinon';
import EdChat from '../../../edChat';
import Client from '../../../messaging/clients/client';
import Message from '../../../messaging/router/message';
import Relay from '../../../messaging/relays/relay';

export default class EdChatApiPortTest {
    edChat: EdChat;
    telegramClientNumber: number;
    greeting: any;
    greetingSpy: any;
    constructor() {
        describe('EdChat Test', () => {
            before(done => {
                // fetch clients from config
                const chatroomListPath = path.resolve(__dirname, '../', '../', '../', '../', 'chatroomList.json');
                fs.readFile(chatroomListPath, 'utf-8', (err: Error, data: any) => {
                    if (err) throw err;
                    this.telegramClientNumber = Object.keys(JSON.parse(data)).length;
                    // create edChat instance
                    this.edChat = new EdChat(5353, process.env.TELEGRAM_TOKEN, () => {
                        this.greeting = (client: Client, callback: () => void) => {};
                        this.greetingSpy = sinon.spy(this.greeting);
                        this.edChat.apiPort.on('greeting', (client: Client, callback: () => {}) => {
                            this.edChat.clients.add(client);
                            // this.edChat.telegramClients.add(client);
                            this.greetingSpy();
                            if (this.greetingSpy.callCount === this.telegramClientNumber) {
                                done();
                            }
                            callback();
                        });
                    });
                });
            });

            // checked that the greeting values retrieved in the before() block are correct
            it('apiPort greetings match number of users in config file', () => {
                expect(this.greetingSpy.callCount).equal(this.telegramClientNumber);
            });

            it('commandOut() does not throw error', done => {
                // create relay from each client to the nekt for test
                this.edChat.clients.forEach(clientFrom => {
                    this.edChat.clients.forEach(clientTo => {
                        const relay: Relay = new Relay(clientFrom, clientTo);
                        this.edChat.relays.add(relay);
                    });
                });
                // execute all the relays with a test message and go on to next test when done
                let counter: number = 0;
                this.edChat.telegramClients.forEach(client => {
                    this.edChat.apiPort.commandOut(client, new Message('test command out'), () => {
                        // call done only once all commands have been called
                        if (counter === this.edChat.telegramClients.index.length - 1) done();
                        counter += 1;
                    });
                });
            });

            it('out() does no throw error', done => {
                let counter: number = 0;
                this.edChat.relays.forEach(relay => {
                    this.edChat.apiPort.out(relay, new Message('test message'), () => {
                        // call done only once all relays have been used in a message
                        if (counter === this.edChat.relays.index.length - 1) done();
                        counter += 1;
                    });
                });
            });

            it('this.edChat.apiPort.on(\'in\', (client: Client, msg: Message) => void) emmitted and received as expected', done => {
                this.edChat.apiPort.on('in', (client: Client, msg: Message) => {
                    done();
                });
                this.edChat.apiPort.emit('in', new Client(), new Message('bla'));
            });

            it('this.edChat.apiPort.on(\'fetchClientFromId\', (chatId: Client, () => void) emmitted and callback executed as expected', done => {
                let counter: number = 0;
                let clientId: number;
                this.edChat.telegramClients.forEach(client => {
                    if (counter === 0) clientId = client.id;
                    counter += 1;
                });
                this.edChat.apiPort.emit('fetchClientFromId', clientId, (client: Client) => {
                    assert.equal(client.id, clientId);
                    done();
                });
            });
        });
    }
}
