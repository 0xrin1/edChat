import { TSMap } from 'typescript-map';
import Client from "./client";

export default class Clients {
    index: TSMap<number, Client>;
    constructor(clients?: TSMap<number, Client>) {
        // TODO: verify that [] compatible with Array<string>
        if (clients) {
            this.index = clients;
        } else {
            this.index = new TSMap();
        }
    }

    get(): TSMap<number, Client> {
        return this.index;
    }

    getClient(id: number): Client {
        return this.index.get(id);
    }

    set(clients: TSMap<number, Client>): void {
        this.index = clients;
    }

    add(client: Client): void {
        this.index.set(client.id, client);
    }

    remove(client: Client): void {
        this.index.delete(client.id);
    }

    // for external use
    forEach(callback: (client: Client) => void): void {
        this.index.forEach((client: Client) => {
            callback(client);
        });
    }
}
