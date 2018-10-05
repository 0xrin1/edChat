"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const apiPort_1 = require("./messaging/apiPort");
const browserPort_1 = require("./messaging/browserPort");
const clients_1 = require("./messaging/clients/clients");
const relays_1 = require("./messaging/relays/relays");
const relay_1 = require("./messaging/relays/relay");
const router_1 = require("./messaging/router/router");
const commands_1 = require("./messaging/commands/commands");
const toolbox_1 = require("./utilities/toolbox");
const response_1 = require("./messaging/api/response");
class EdChat {
    constructor(port, tgKey, loaded) {
        this.port = port;
        this.tgKey = tgKey;
        this.apiPort = new apiPort_1.default(this.tgKey, () => {
            loaded();
        });
        this.browserPort = new browserPort_1.default(this.port);
        this.clients = new clients_1.default();
        this.telegramClients = new clients_1.default();
        this.relays = new relays_1.default();
        this.router = new router_1.default();
        this.commands = new commands_1.default();
        this.toolbox = new toolbox_1.default();
        this.apiPort.on('greeting', (client, callback) => { this.apiGreeting(client, callback); });
        this.apiPort.on('command-initialization', (client, command, callback) => { this.apiCommandInitialization(client, command, callback); });
        this.apiPort.on('command-execution', (client, command, params, callback) => { this.apiCommandExecution(client, command, params, callback); });
        this.apiPort.on('in', (client, message) => { this.apiIn(client, message); });
        this.apiPort.on('fetchClientFromId', (id, callback) => { this.apiFetchClientFromId(id, callback); });
        this.browserPort.on('greeting', (client, callback) => { this.browserGreeting(client, callback); });
        this.browserPort.on('in', (client, message, callback) => { this.browserIn(client, message, callback); });
        this.browserPort.on('disconnect', (client) => { this.browserDisconnect(client); });
        this.browserPort.on('request-list', (client, callback) => { this.browserRequestList(client, callback); });
        this.browserPort.on('request-list-relay', (client, callback) => { this.browserRequestListRelay(client, callback); });
        this.router.on('telegram', (relay, message) => { this.routerTelegram(relay, message); });
        this.router.on('edChatBrowser', (relay, message) => { this.routerEdChatBrowser(relay, message); });
        this.commands.on('setRelay', (client, id, callback) => { this.commandSetRelay(client, id, callback); });
        this.commands.on('unsetRelay', (client, id, callback) => { this.commandUnSetRelay(client, id, callback); });
    }
    apiGreeting(client, callback) {
        this.clients.add(client);
        this.telegramClients.add(client);
        callback();
    }
    apiCommandInitialization(client, command, callback) {
        this.commands.initialize(client, command, this.clients, (keyboard) => {
            callback(keyboard);
        });
    }
    apiCommandExecution(client, command, param, callback) {
        this.commands.execute(client, command, param, (response) => {
            callback(response);
        });
    }
    apiIn(client, message) {
        const msgRelays = this.relays.toRelays(client);
        this.router.route(msgRelays, message);
    }
    apiFetchClientFromId(id, callback) {
        callback(this.clients.getClient(id));
    }
    browserGreeting(client, callback) {
        this.clients.add(client);
        this.relays.oneToAll(client, this.telegramClients);
        callback();
    }
    browserDisconnect(client) {
        client.relays.from.forEach(relayId => {
            const relay = this.relays.getRelay(relayId);
            const fromClientId = relay.from.id;
            const fromClient = this.clients.getClient(fromClientId);
            fromClient.relays.to = fromClient.relays.to.filter(toId => {
                return toId !== relayId;
            });
        });
        client.relays.to.forEach(relayId => {
            const relay = this.relays.getRelay(relayId);
            const toClientId = relay.to.id;
            const toClient = this.clients.getClient(toClientId);
            toClient.relays.from = toClient.relays.from.filter(fromId => {
                return fromId !== relayId;
            });
        });
        this.relays.removeClientRelays(client);
        this.clients.remove(client);
    }
    browserIn(client, message, callback) {
        const msgRelays = this.relays.toRelays(client);
        this.router.route(msgRelays, message);
        callback(new response_1.default('message received by server'));
    }
    browserRequestList(client, callback) {
        callback(this.clients);
    }
    browserRequestListRelay(client, callback) {
        callback(this.relays);
    }
    routerTelegram(relay, message) {
        this.apiPort.out(relay, message, () => {
        });
    }
    routerEdChatBrowser(relay, message) {
        this.browserPort.out(relay, message);
    }
    commandResponse(client, response) {
        this.apiPort.commandOut(client, response, () => {
        });
    }
    commandSetRelay(fromClient, toClientId, callback) {
        const toClient = this.clients.getClient(toClientId);
        this.relays.add(new relay_1.default(fromClient, toClient));
        callback();
    }
    commandUnSetRelay(client, id, callback) {
        const relays = this.relays.getRelaysWithClientIds(client.id, id);
        relays.forEach(relay => {
            this.relays.remove(relay);
        });
        this.toolbox.deleteFromArray(client.relays.to, id);
        this.toolbox.deleteFromArray(client.relays.from, id);
        callback();
    }
}
exports.default = EdChat;
//# sourceMappingURL=edChat.js.map