"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../clients/client");
class Connection {
    constructor(socket, browserPort) {
        this.socket = socket;
        this.browserPort = browserPort;
        socket.on('greeting', (greeting) => { this.greeting(greeting); });
        socket.on('disconnect', () => { this.disconnect(); });
        socket.on('message', (message, callback) => { this.in(message, callback); });
        socket.on('request-list', (client, callback) => { this.requestList(client, callback); });
        socket.on('request-list-relay', (client, callback) => { this.requestListRelay(client, callback); });
    }
    greeting(greeting) {
        this.client = new client_1.default(greeting);
        this.client.setBrowser(this.socket.handshake.address);
        this.browserPort.emit('greeting', this.client, () => {
            this.socket.join(greeting.id);
        });
    }
    disconnect() {
        this.browserPort.emit('disconnect', this.client);
    }
    in(message, callback) {
        this.browserPort.emit('in', this.client, message, (response) => {
            callback(response);
        });
    }
    requestList(client, callback) {
        this.browserPort.emit('request-list', client, (clients) => {
            callback(clients);
        });
    }
    requestListRelay(client, callback) {
        this.browserPort.emit('request-list-relay', client, (relays) => {
            callback(relays);
        });
    }
}
exports.default = Connection;
//# sourceMappingURL=connection.js.map