import * as dotenv from 'dotenv';
dotenv.config();

import EdChat from './edChat';

new EdChat(parseInt(process.env.PORT), process.env.TELEGRAM_TOKEN, () => {
    console.log('EdChat started');
});
