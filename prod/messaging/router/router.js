"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const request = require("request");
class Router extends events.EventEmitter {
    route(relays, message) {
        relays.forEach((relay) => {
            this.emit(relay.to.platform, relay, message);
        });
        this.logMessage(relays, message);
        console.log('message that is being sent for logging', message);
    }
    logMessage(relays, message) {
        console.log('sending logMessage post request');
        request.post({
            url: `${process.env.EDFETCH_URL}/log-message`,
            form: {
                relays,
                message,
                username: process.env.EDFETCH_USER,
                key: process.env.EDFETCH_KEY,
            },
        }, (err, httpResponse, body) => {
            if (err)
                throw err;
            console.log(body);
        });
    }
}
exports.default = Router;
//# sourceMappingURL=router.js.map