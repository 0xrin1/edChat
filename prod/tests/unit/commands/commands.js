"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const commands_1 = require("../../../messaging/commands/commands");
class CommandsTest {
    constructor() {
        describe('Commands Test', () => {
            it('new Commands() to be an instance of Commands', () => {
                chai_1.expect(new commands_1.default()).to.be.an.instanceof(commands_1.default);
            });
            it('Command index r key mapped to setRelay function', () => {
                const commands = new commands_1.default();
                const checkFunction = commands.index.get('r');
                chai_1.assert.equal(checkFunction, commands.setRelay);
            });
            it('Command index u key mapped to unsetRelay function', () => {
                const commands = new commands_1.default();
                const checkFunction = commands.index.get('u');
                chai_1.assert.equal(checkFunction, commands.unsetRelay);
            });
        });
    }
}
exports.default = CommandsTest;
//# sourceMappingURL=commands.js.map