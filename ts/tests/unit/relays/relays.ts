import { assert, expect, use } from 'chai';
// forced to import with require. See: https://github.com/mesaugat/chai-exclude
import chaiExclude = require('chai-exclude');
// import { TSMap } from 'typescript-map';

import Relays from '../../../messaging/relays/relays';
import Relay from '../../../messaging/relays/relay';
import Client from '../../../messaging/clients/client';
import Clients from '../../../messaging/clients/clients';

use(chaiExclude);

export default class RelaysTest {
    relays: Relays;
    constructor() {
        describe('Relays Tests', () => {
            it('new Relays() to be an instance of Relays', () => {
                expect(new Relays()).to.be.an.instanceof(Relays);
            });

            it('get() returns Relays.index TSMap<number, Relay>', () => {
                const client: Client = new Client();
                const client1: Client = new Client();
                const relay: Relay = new Relay(client, client1);
                const relays = new Relays();
                relays.add(relay);
                assert.deepEqual(relays.get(), relays.index);
            });

            it('getRelay(id: number) returns correct Relay Object from number', () => {
                const client: Client = new Client();
                const client1: Client = new Client();
                const expectedRelay: Relay = new Relay(client, client1);
                const relays = new Relays();
                relays.add(expectedRelay);
                const actualRelay = relays.getRelay(expectedRelay.id);
                assert.deepEqual(actualRelay, expectedRelay);
            });

            it('add() followed by getRelay() returns same relay', () => {
                const client: Client = new Client();
                const client1: Client = new Client();
                const relay: Relay = new Relay(client, client1);
                const relays: Relays = new Relays();
                relays.add(relay);
                assert.deepEqual(relays.getRelay(relay.id), relay);
            });

            it('remove() behaves as expected', () => {
                const client: Client = new Client();
                const client1: Client = new Client();
                const relay: Relay = new Relay(client, client1);
                const relays: Relays = new Relays();
                relays.add(relay);
                relays.remove(relay);
                assert.equal(relays.index.length, 0);
            });

            it('oneToAll() creates expected relays', () => {
                // instantiate clients to be used for relays
                const fromClient: Client = new Client();
                const toClient: Client = new Client();
                const toClient1: Client = new Client();
                const toClients: Clients = new Clients();
                // define desired test result
                const expectedRelays: Relays = new Relays();
                expectedRelays.add(new Relay(fromClient, toClient)); // fromClient -> toClient
                expectedRelays.add(new Relay(fromClient, toClient1)); // fromClient -> toClient1
                toClients.add(toClient);
                toClients.add(toClient1);
                const relays: Relays = new Relays();
                relays.oneToAll(fromClient, toClients);
                // Ignore all instances of Id, because they are unique.
                // Otherwise the test will never pass.
                assert.deepEqualExcludingEvery(relays, expectedRelays, ['_keys', 'id']);
            });

            it('getRelaysByClientIds() returns expected Relays', () => {
                const clientFrom: Client = new Client();
                const clientTo: Client = new Client();
                const idFrom = clientFrom.id;
                const idTo = clientTo.id;
                const relays : Relays = new Relays();
                const expectedRelays: Relays = new Relays();
                const relay = new Relay(clientFrom, clientTo);
                const relay1 = new Relay(new Client(), new Client());
                // add relay that will be retrieved and is expected
                relays.add(relay);
                expectedRelays.add(relay);
                // add another relay that will not be retrieved
                relays.add(relay1); // can add as many as I like
                relays.add(relay1);
                const actualRelays: Relays = relays.getRelaysWithClientIds(idFrom, idTo);
                assert.deepEqual(actualRelays, expectedRelays);
            });

            it('toRelays() returns all Relays relevant to Client', () => {
                // declare main test Relays instantiation
                const relays: Relays = new Relays();
                const expectedRelays: Relays = new Relays();
                // declare test Client instantiations
                const targetClient: Client = new Client();
                const dummyClient: Client = new Client();
                const dummyClient1: Client = new Client();
                // declare test Relay instantiations
                const targetRelay: Relay = new Relay(targetClient, dummyClient);
                const targetRelay1: Relay = new Relay(dummyClient, targetClient);
                const dummyRelay: Relay = new Relay(dummyClient, dummyClient1);

                const dummyRelay1: Relay = new Relay(dummyClient1, dummyClient);
                // add Relay instantiations to relevant Relays instantiations
                relays.add(targetRelay);
                relays.add(targetRelay1);
                relays.add(dummyRelay);
                relays.add(dummyRelay1);
                expectedRelays.add(targetRelay);
                // expectedRelays.add(targetRelay1);
                // execute function to test
                const actualRelays: Relays = relays.toRelays(targetClient);
                // assertion
                assert.deepEqual(actualRelays, expectedRelays);
            });

            it('removeClientRelays() removes all Relay Objects affected by client', () => {
                // declare main test Relays instantiation
                const actualRelays: Relays = new Relays();
                const expectedRelays: Relays = new Relays();
                // declare test Client instantiations
                const targetClient: Client = new Client();
                const dummyClient: Client = new Client();
                const dummyClient1: Client = new Client();
                // declare test Relay instantiations
                const targetRelay: Relay = new Relay(targetClient, dummyClient);
                const targetRelay1: Relay = new Relay(dummyClient, targetClient);
                const dummyRelay: Relay = new Relay(dummyClient, dummyClient1);
                const dummyRelay1: Relay = new Relay(dummyClient1, dummyClient);
                // add Relay instantiations to relevant Relays instantiations
                actualRelays.add(targetRelay);
                actualRelays.add(targetRelay1);
                actualRelays.add(dummyRelay);
                actualRelays.add(dummyRelay1);
                expectedRelays.add(dummyRelay);
                expectedRelays.add(dummyRelay1);
                // execute function to test
                actualRelays.removeClientRelays(targetClient);
                // assertion
                assert.deepEqual(actualRelays, expectedRelays);
            });
        });
    }
}
