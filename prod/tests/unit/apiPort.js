"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const fs = require("fs");
const chai_1 = require("chai");
const apiPort_1 = require("../../messaging/apiPort");
class ApiPortTest {
    constructor() {
        before((done) => {
            this.apiPort = new apiPort_1.default(process.env.TELEGRAM_TOKEN_TEST, () => {
                done();
            });
        });
        it('loadChatrooms() loads chatRooms as expected', () => {
            const filePath = path.join(__dirname, '../', '../', '../', 'chatroomList.json');
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err)
                    throw err;
                const json = JSON.parse(data);
                const keys = Object.keys(json);
                let counter = 0;
                keys.forEach(key => {
                    this.apiPort.chatrooms.forEach(chatroom => {
                        if (parseInt(key) === chatroom.id)
                            counter += 1;
                    });
                });
                chai_1.assert.equal(counter, this.apiPort.chatrooms.length);
            });
        });
    }
}
exports.default = ApiPortTest;
//# sourceMappingURL=apiPort.js.map