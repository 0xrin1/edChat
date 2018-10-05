import * as dotenv from 'dotenv';
dotenv.config();
import { expect } from 'chai';


import EdChat from '../../edChat';
import Client from '../../messaging/clients/client';

export default class RelaysTest {
    constructor() {
        describe('EdChat Test', () => {
            it('new EdChat() to be an instance of EdChat', () => {
                expect(new EdChat(4343, process.env.TELEGRAM_TOKEN_TEST, () => {})).to.be.an.instanceof(EdChat);
            });
        });
    }
}
