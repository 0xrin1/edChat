import { assert, expect } from 'chai';

import Connection from '../../../messaging/socketio/connection';
import BrowserPort from '../../../messaging/browserPort';

export default class BrowserPortTest {
    browserPort: BrowserPort;
    constructor() {
        before(() => {
            this.browserPort = new BrowserPort(4444);
        });
    }
}
