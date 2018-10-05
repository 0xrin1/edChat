"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(text) {
        this.setText(text);
        this.date = new Date();
        console.log('creating message', this);
    }
    setText(text) {
        if (text.length !== 0)
            this.text = text;
        else
            this.text = ' ';
    }
    telegramFormat(client) {
        return `\
<b>id</b>: <i>${client.id}</i>
<b>ip</b>: <i>${client.ip}</i>
<b>name</b>: <i>${client.name}</i>
<b>project</b>: <i>${client.project}</i>
<b>platform</b>: <i>${client.platform}</i>\n
${this.text}`;
    }
}
exports.default = Message;
//# sourceMappingURL=message.js.map