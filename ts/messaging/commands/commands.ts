import * as events from 'events';
import { TSMap } from 'typescript-map';

import Client from '../clients/client';
import Clients from '../clients/clients';
import Message from '../router/message';
import Keyboard from './keyboard';
// import Command from './command';

// my approach for this class so far: do as much of the command processing here and try to refer to
// app.ts as litte as possible
export default class Commands extends events.EventEmitter {
    index: TSMap<string, (context: Commands, client: Client, param: any, callback: (param: any) => any) => void>;
    // TODO: could potentially add map that contains aliases
    constructor() {
        super();
        this.index = new TSMap();
        this.index.set('r', this.setRelay);
        this.index.set('u', this.unsetRelay);
    }

    execute(client: Client, name: string, param: any, callback: (response: Message) => void): void {
        // type definition for execution implied from index
        if (this.index.has(name)) {
            const execution = this.index.get(name);
            execution(this, client, param, (response: Message) => {
                callback(response);
            });
        }
    }

    initialize(client: Client, command: string, clients: Clients, callback: (keyboard: Keyboard) => void): void {
        if (this.index.has(command)) {
            const clientArray: Array<Client> = [];
            clients.forEach(client => {
                clientArray.push(client);
            });
            callback(new Keyboard(clientArray));
        }
    }

    setRelay(commandContext: Commands, client: Client, param: Array<string>, callback: (response: Message) => {}): void {
        commandContext.emit('setRelay', client, parseInt(param[0]), () => {
            callback(new Message(`Relay created to client ${param[0]}`));
        });
    }

    unsetRelay(commandContext: Commands, client: Client, id: number, callback: (response: Message) => {}): void {
        commandContext.emit('unsetRelay', client, id, () => {
            callback(new Message(`Relay removed`));
        });
    }
}
