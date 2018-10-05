import * as events from 'events';
import * as request from 'request';

import Message from "./message";
import Relays from "../relays/relays";

export default class Router extends events.EventEmitter {
    router: any;
    route(relays: Relays, message: Message) {
        // for each relay sent with this message,
        // send the message through specified platform
        // to destination client
        relays.forEach((relay) => {
            this.emit(relay.to.platform, relay, message);
        });
        this.logMessage(relays, message);
        console.log('message that is being sent for logging', message);
    }

    logMessage(relays: Relays, message: Message): void {
        console.log('sending logMessage post request');
        request.post({
            url: `${process.env.EDFETCH_URL}/log-message`,
            form: {
                relays,
                message,
                username: process.env.EDFETCH_USER,
                key: process.env.EDFETCH_KEY,
            },
        }, (err: Error, httpResponse: any, body: any) => {
            if (err) throw err;
            console.log(body);
        });
    }
}
