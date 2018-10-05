"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const edChat_1 = require("./edChat");
new edChat_1.default(parseInt(process.env.PORT), process.env.TELEGRAM_TOKEN, () => {
    console.log('EdChat started');
});
//# sourceMappingURL=app.js.map