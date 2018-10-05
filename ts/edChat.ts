import * as dotenv from 'dotenv';
dotenv.config();

import * as gcloudDebugAgent from '@google-cloud/debug-agent';
// gcloudDebugAgent.start({
//     // projectId: process.env.GOOGLE_PROJECT,
// });

import ApiPort from './messaging/apiPort';
import BrowserPort from './messaging/browserPort';
import Client from './messaging/clients/client';
import Clients from './messaging/clients/clients';
import Relays from './messaging/relays/relays';
import Relay from './messaging/relays/relay';
import Message from './messaging/router/message';
import Router from './messaging/router/router';
import Commands from './messaging/commands/commands';
import Keyboard from './messaging/commands/keyboard';
import Toolbox from './utilities/toolbox';
import Response from './messaging/api/response';
import { callbackify } from 'util';

export default class EdChat {
    port: number;
    tgKey: string;
    apiPort: ApiPort;
    browserPort: BrowserPort;
    clients: Clients;
    telegramClients: Clients;
    relays: Relays;
    router: Router;
    commands: Commands;
    toolbox: Toolbox;
    constructor(port: number, tgKey: string, loaded: () => void) {
        // if port not given default to .env value
        this.port = port;
        this.tgKey = tgKey;
        this.apiPort = new ApiPort(this.tgKey, () => {
            loaded();
        }); // :Msg specification is reduntant afaik
        this.browserPort = new BrowserPort(this.port);
        this.clients = new Clients();
        this.telegramClients = new Clients();
        this.relays = new Relays();
        this.router = new Router();
        this.commands = new Commands();
        this.toolbox = new Toolbox();

        // events that had to be mapped to functions somewhere...
        // which is why I decided to make each one a one-linr
        // now that I look this part over again I find the typed rigor totally unecessary
        this.apiPort.on('greeting', (client: Client, callback: () => void): void => { this.apiGreeting(client, callback) });
        this.apiPort.on('command-initialization', (client: Client, command: string, callback: (keyboard: Keyboard) => void): void => { this.apiCommandInitialization(client, command, callback) });
        this.apiPort.on('command-execution', (client: Client, command: string, params: Array<string>, callback: (response: Message) => void): void => { this.apiCommandExecution(client, command, params, callback) });
        this.apiPort.on('in', (client: Client, message: Message): void => { this.apiIn(client, message) });
        this.apiPort.on('fetchClientFromId', (id: number, callback: () => void): void => { this.apiFetchClientFromId(id, callback) });

        this.browserPort.on('greeting', (client: Client, callback: () => void): void => { this.browserGreeting(client, callback) });
        this.browserPort.on('in', (client: Client, message: Message, callback: (response: Response) => void): void => { this.browserIn(client, message, callback) });
        this.browserPort.on('disconnect', (client: Client): void => { this.browserDisconnect(client) });
        this.browserPort.on('request-list', (client: Client, callback: (clients: Clients) => void): void => { this.browserRequestList(client, callback) });
        this.browserPort.on('request-list-relay', (client: Client, callback: (relays: Relays) => void): void => { this.browserRequestListRelay(client, callback) });

        this.router.on('telegram', (relay: Relay, message: Message) => { this.routerTelegram(relay, message) });
        this.router.on('edChatBrowser', (relay: Relay, message: Message) => { this.routerEdChatBrowser(relay, message) });

        this.commands.on('setRelay', (client: Client, id: number, callback: () => void) => { this.commandSetRelay(client, id, callback) });
        this.commands.on('unsetRelay', (client: Client, id: number, callback: () => void) => { this.commandUnSetRelay(client, id, callback) });
    }

    apiGreeting(client: Client, callback: () => void): void {
        // keep track of all clients
        this.clients.add(client);
        // keep track of telegram clients in own list as they rarely change
        this.telegramClients.add(client);
        callback();
    }

    apiCommandInitialization(client: Client, command: string, callback: (keyboard: Keyboard) => void): void {
        this.commands.initialize(client, command, this.clients, (keyboard: Keyboard) => {
            callback(keyboard);
        });
    }

    apiCommandExecution(client: Client, command: string, param: Array<string>, callback: (response: Message) => void): void {
        // subcontract commands to commands class
        this.commands.execute(client, command, param, (response) => {
            callback(response);
        });
    }

    apiIn(client: Client, message: Message): void {
        const msgRelays: Relays = this.relays.toRelays(client);
        this.router.route(msgRelays, message);
    }

    apiFetchClientFromId(id: number, callback: (client: Client) => void): void {
        callback(this.clients.getClient(id));
    }

    browserGreeting(client: Client, callback: () => void): void {
        // add connected edChatBrowser client to client list
        this.clients.add(client);
        // for each connected telegram client, create a
        // relay from this edChatBrowser clien to said client
        this.relays.oneToAll(client, this.telegramClients);
        callback();
    }

    browserDisconnect(client: Client): void {
        // iterate over all from relay keys
        client.relays.from.forEach(relayId => {
            // for each relay id with affected from client
            // get the relay from the id
            const relay: Relay = this.relays.getRelay(relayId);
            // get the id of the from client
            const fromClientId: number = relay.from.id;
            // get Client from fromClientId
            const fromClient: Client = this.clients.getClient(fromClientId);
            // iterate through to values of fromClient
            // return all to values that do not match the relay id
            // assign returned to values to fromClient to values
            fromClient.relays.to = fromClient.relays.to.filter(toId => {
              return toId !== relayId;
            });
        });
        client.relays.to.forEach(relayId => {
            // for each relay id with affected to client
            // get the relay from the id
            const relay: Relay = this.relays.getRelay(relayId);
            // get the id of the from client
            const toClientId: number = relay.to.id;
            // get Client from ToClientId
            const toClient: Client = this.clients.getClient(toClientId);
            // iterate through the values of toClient
            // return all from values that do not match the relay id
            // assign returned from values to toClient from values
            toClient.relays.from = toClient.relays.from.filter(fromId => {
              return fromId !== relayId;
            });
        });
        this.relays.removeClientRelays(client);
        this.clients.remove(client);
    }

    browserIn(client: Client, message: Message, callback: (response: Response) => void ): void {
        // all messages that come from the browser module directly
        // spit into all open relays that are relevant to the browser connection
        const msgRelays: Relays = this.relays.toRelays(client);
        this.router.route(msgRelays, message);
        callback(new Response('message received by server'));
    }

    browserRequestList(client: Client, callback: (client: Clients) => void ): void {
        // client will be used for authentication
        callback(this.clients);
    }

    browserRequestListRelay(client: Client, callback: (relays: Relays) => void ): void {
        // client will be used for authentication
        callback(this.relays);
    }

    routerTelegram(relay: Relay, message: Message): void {
        this.apiPort.out(relay, message, () => {
            // can add logic confirming that message has been sent
        });
    }

    routerEdChatBrowser(relay: Relay, message: Message): void {
        this.browserPort.out(relay, message);
    }

    commandResponse(client: Client, response: Message): void {
        this.apiPort.commandOut(client, response, () => {
            // can add logic confirming that command has been responded to
        });
    }

    commandSetRelay(fromClient: Client, toClientId: number, callback: () => void): void {
        // fetch client from id && create relay
        const toClient: Client = this.clients.getClient(toClientId);
        // check if relay has to address, in case getClient returns nothing
        // because the client id is an empty string or doesn't exist
        this.relays.add(new Relay(fromClient, toClient));
        callback();
    }

    commandUnSetRelay(client: Client, id: number, callback: () => void): void {
        // find id of relay by providing to address (id)
        const relays: Relays = this.relays.getRelaysWithClientIds(client.id, id);
        relays.forEach(relay => {
            this.relays.remove(relay);
        });

        // then remove the relay index from the client
        this.toolbox.deleteFromArray(client.relays.to, id);
        this.toolbox.deleteFromArray(client.relays.from, id);
        callback();
    }
}
