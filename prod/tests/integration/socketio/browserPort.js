"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browserPort_1 = require("../../../messaging/browserPort");
class BrowserPortTest {
    constructor() {
        before(() => {
            this.browserPort = new browserPort_1.default(4444);
        });
    }
}
exports.default = BrowserPortTest;
//# sourceMappingURL=browserPort.js.map