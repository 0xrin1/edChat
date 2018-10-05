import { assert, expect } from 'chai';

import Relay from '../../../messaging/relays/relay';
import Client from '../../../messaging/clients/client';

export default class RelayTest {
    client: Client;
    client1: Client;
    constructor() {
        describe('Relay Tests', () => {
            before(() => {
                // setting up Dummie clients for testing
                this.client = new Client();
                this.client1 = new Client();
            });

            it('new Relay() to be instance of Relay', () => {
                expect(new Relay(this.client, this.client1)).to.be.an.instanceof(Relay);
            });

            it('setTo() sets to value to expected client', () => {
                const relay = new Relay(new Client(), new Client());
                relay.setTo(this.client);
                assert.deepEqual(relay.to, this.client);
            });

            it('getFrom() returns expected client', () => {
                const relay = new Relay(new Client(), new Client());
                relay.setFrom(this.client);
                assert.deepEqual(relay.from, this.client);
            });

            it('getTo() returns expected client', () => {
                const relay = new Relay(this.client, this.client1);
                assert.deepEqual(relay.getTo(), this.client1);
            });

            it('constructor() vs setTo() + setFrom()', () => {
                const relay = new Relay(this.client, this.client1);
                // constructor parameters below need to be given because not optional
                // but they are overridden by the subsequent commands, therefore ignored
                const relay1 = new Relay(new Client(), new Client());
                // make IDs equal otherwise the test will never pass
                // because each relay instantiation has a unique ID by design
                relay1.id = relay.id;
                relay1.setFrom(this.client);
                relay1.setTo(this.client1);
                assert.deepEqual(relay, relay1);
            });
        });
    }
}
