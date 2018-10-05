"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const Io = require("socket.io");
const express = require("express");
const cors = require("cors");
const client_1 = require("./clients/client");
const connection_1 = require("./socketio/connection");
class BrowserPort extends events.EventEmitter {
    constructor(port) {
        super();
        this.app = express();
        this.app.use(cors());
        this.io = Io.listen(this.app.listen(port), {
            cookie: false,
        });
        console.log(`Listening on port ${port}`);
        this.app.get('/', (req, res) => { this.serveHome(req, res); });
        this.app.get('/relays', (req, res) => { this.serveRelays(req, res); });
        this.io.sockets.on('connection', (socket) => { this.connection(socket); });
    }
    connection(socket) {
        new connection_1.default(socket, this);
    }
    serveHome(req, res) {
        let client = new client_1.default();
        this.emit('request-list', client, (clients) => {
            res.send(clients);
        });
    }
    serveRelays(req, res) {
        let client = new client_1.default();
        this.emit('request-list-relay', client, (relays) => {
            res.send(relays.json());
        });
    }
    out(relay, message) {
        this.io.in(relay.to.id).emit('message', message);
    }
}
exports.default = BrowserPort;
//# sourceMappingURL=browserPort.js.map