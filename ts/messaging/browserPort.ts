import * as events from 'events';
import * as Io from 'socket.io';
import * as express from 'express';
import * as cors from 'cors';

// import Greeting from "./clients/greeting";
import Client from "./clients/client";
import Clients from "./clients/clients";
import Relay from "./relays/relay";
import Relays from "./relays/relays";
// import Response from "./api/response";
import Message from "./router/message";
import Connection from "./socketio/connection";

export default class BrowserPort extends events.EventEmitter {
    app: any; // TODO: this seems like a hack
    io: any; // TODO: this seems like a hack
    client: Client;
    constructor(port: number) {
        super();

        this.app = express();
        this.app.use(cors());

        this.io = Io.listen(this.app.listen(port), {
            cookie: false,
        });

        console.log(`Listening on port ${port}`);

        this.app.get('/', (req: JSON, res: JSON): void => { this.serveHome(req, res) });
        this.app.get('/relays', (req: JSON, res: JSON): void => { this.serveRelays(req, res) });

        this.io.sockets.on('connection', (socket: any): void => { this.connection(socket) });
    }

    connection(socket: any) {
        new Connection(socket, this);
    }

    serveHome(req: any, res: any) {
        let client: Client = new Client();
        this.emit('request-list', client, (clients: Clients): void => {
            res.send(clients);
        });
    }

    serveRelays(req: any, res: any) {
        let client: Client = new Client();
        this.emit('request-list-relay', client, (relays: Relays): void => {
            res.send(relays.json());
        });
    }

    out(relay: Relay, message: Message): void {
        this.io.in(relay.to.id).emit('message', message);
    }
}
