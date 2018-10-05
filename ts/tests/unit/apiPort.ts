import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import * as fs from 'fs';
import { assert, expect } from 'chai';
import ApiPort from '../../messaging/apiPort';

export default class ApiPortTest {
    apiPort: ApiPort;
    constructor() {
        before((done) => {
            this.apiPort = new ApiPort(process.env.TELEGRAM_TOKEN_TEST, () => {
                done();
            });
        });

        it('loadChatrooms() loads chatRooms as expected', () => {
            // was already called in constructor
            // so just test against content in fs
            const filePath = path.join(__dirname, '../', '../', '../', 'chatroomList.json');
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) throw err;
                const json: any = JSON.parse(data);
                // just check the json keys against the ids of the chatRooms
                const keys = Object.keys(json);
                let counter: number = 0;
                keys.forEach(key => {
                    this.apiPort.chatrooms.forEach(chatroom => {
                        if (parseInt(key) === chatroom.id) counter += 1;
                    });
                });
                assert.equal(counter, this.apiPort.chatrooms.length);
            });
        });
    }
}
