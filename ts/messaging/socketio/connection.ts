import BrowserPort from '../browserPort';
import Client from '../clients/client';
import Clients from '../clients/clients';
import Greeting from '../clients/greeting';
import Relay from '../relays/relay';
import Relays from '../relays/relays';
import Message from '../router/message';

export default class Connection {
    client: Client;
    browserPort: BrowserPort;
    socket: any;
    constructor(socket: any, browserPort: BrowserPort) {
        // TODO: make greeting event obsolete by using socket.io handshake
        this.socket = socket;
        this.browserPort = browserPort;
        socket.on('greeting', (greeting: Greeting) => { this.greeting(greeting) });
        socket.on('disconnect', (): void => { this.disconnect() });
        socket.on('message', (message: Message, callback: (response: Response) => void): void => { this.in(message, callback) });
        socket.on('request-list', (client: Client, callback: (clients: Clients) => void): void => { this.requestList(client, callback) });
        socket.on('request-list-relay', (client: Client, callback: (relays: Relays) => void): void => { this.requestListRelay(client, callback)});
    }

    greeting(greeting: Greeting): void {
        this.client = new Client(greeting);
        this.client.setBrowser(this.socket.handshake.address);
        this.browserPort.emit('greeting', this.client, (): void => {
            this.socket.join(greeting.id);
        });
    }

    disconnect(): void {
        this.browserPort.emit('disconnect', this.client);
    }

    in(message: Message, callback: (response: Response) => void): void {
        this.browserPort.emit('in', this.client, message, (response: Response): void => {
            callback(response);
        });
    }

    requestList(client: Client, callback: (clients: Clients) => void): void {
        this.browserPort.emit('request-list', client, (clients: Clients): void => {
            callback(clients);
        });
    }

    requestListRelay(client: Client, callback: (relays: Relays) => void): void {
        this.browserPort.emit('request-list-relay', client, (relays: Relays): void => {
            callback(relays);
        });
    }
}
