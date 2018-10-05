import Client from "../clients/client";
import Id from "../../utilities/id";

export default class Relay {
    id: number;
    from: Client;
    to: Client;
    constructor(from: Client, to: Client) {
        this.id = new Id().get();
        this.setFrom(from);
        this.setTo(to);
        this.setClientRelays();
    }

    setTo(to: Client): void {
        this.to = to;
    }

    setFrom(from: Client): void {
        this.from = from;
    }

    setClientRelays(): void {
        this.from.relays.to.push(this.id);
        this.to.relays.from.push(this.id);
    }

    getTo(): Client {
        return this.to;
    }

    getFrom(): Client {
        return this.from;
    }
}
