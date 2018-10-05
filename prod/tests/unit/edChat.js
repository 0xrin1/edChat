"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const chai_1 = require("chai");
const edChat_1 = require("../../edChat");
class RelaysTest {
    constructor() {
        describe('EdChat Test', () => {
            it('new EdChat() to be an instance of EdChat', () => {
                chai_1.expect(new edChat_1.default(4343, process.env.TELEGRAM_TOKEN_TEST, () => { })).to.be.an.instanceof(edChat_1.default);
            });
        });
    }
}
exports.default = RelaysTest;
//# sourceMappingURL=edChat.js.map