import Client from '../clients/client';

export default class Message {
    text: string;
    date: Date;

    constructor(text: string) {
        this.setText(text);
        this.date = new Date();
        console.log('creating message', this);
    }

    setText(text: string): void {
        // messages should never be empty
        // because basically all messagaging apis don't allow it
        if (text.length !== 0) this.text = text;
        else this.text = ' ';
    }

    telegramFormat(client: Client): string {
        return `\
<b>id</b>: <i>${client.id}</i>
<b>ip</b>: <i>${client.ip}</i>
<b>name</b>: <i>${client.name}</i>
<b>project</b>: <i>${client.project}</i>
<b>platform</b>: <i>${client.platform}</i>\n
${this.text}`;
    }
}
