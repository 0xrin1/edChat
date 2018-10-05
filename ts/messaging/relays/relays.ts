import { TSMap } from 'typescript-map';

import Relay from './relay';
import Client from '../clients/client';
import Clients from '../clients/clients';

export default class Relays {
    index: TSMap<number, Relay>;
    constructor(relays?: TSMap<number, Relay>) {
        if (relays) this.index = relays;
        else this.index = new TSMap();
    }

    // Functions for basic usage

    add(relay: Relay): void {
        this.index.set(relay.id, relay);
    }

    get(): TSMap<number, Relay> {
        return this.index;
    }

    getRelay(id: number): Relay {
        return this.index.get(id);
    }

    // impossible to write an implementation that ensures that just one
    // relay gets returned -- needs to be enforced on the adding side instead
    getRelaysWithClientIds(idFrom: number, idTo: number): Relays {
        const returnRelays: Relays = new Relays();
        this.index.forEach(relay => {
            if (relay.from.id === idFrom && relay.to.id === idTo) returnRelays.add(relay);
        });
        return returnRelays;
    }

    set(relays: TSMap<number, Relay>): void {
        this.index = relays;
    }

    remove(relay: Relay): void {
        this.index.delete(relay.id);
    }

    removeClientRelays(client: Client): void {
        client.relays.from.forEach(relayId => {
            this.index.delete(relayId);
        });
        client.relays.to.forEach(relayId => {
            this.index.delete(relayId);
        });
    }

    // for external use
    forEach(callback: (relay: Relay) => void): void {
        this.index.forEach((relay: Relay) => {
            callback(relay);
        });
    }

    oneToAll(fromClient: Client, toClients: Clients): void {
        toClients.forEach((toClient: Client) => {
            // create new relay (which sets relay values in used clients)
            const relay: Relay = new Relay(fromClient, toClient);
            // add relay to global relay list
            this.add(relay);
        });
    }

    json(): any {
        return this.index.toJSON();
    }

    toRelays(client: Client): Relays {
        const msgRelays: Relays = new Relays();
        client.relays.to.forEach((relayId: any) => {
            msgRelays.add(this.index.get(relayId));
        });
        return msgRelays;
    }
}
