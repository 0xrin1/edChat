import * as events from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as TelegramBot from 'node-telegram-bot-api';

import Client from './clients/client';
import MsgInterface from './telegram/interface/msgInterface';
import Relay from './relays/relay';
import Message from './router/message';
import Chatroom from './telegram/chatroom';
import Keyboard from './commands/keyboard';

export default class ApiPort extends events.EventEmitter {
    bot: any; // TODO: this seems like a hack
    chatId: number;
    chatrooms: Array<Chatroom>;
    constructor(tgKey: string, loaded: () => void) {
        super(); // not sure why

        this.bot = new TelegramBot(tgKey, { polling: true });

        // handle events
        this.bot.on('message', (msg: MsgInterface) => { this.message(msg) });
        this.bot.on('polling_error', (error: Error) => { console.log('polling error', error) });
        this.bot.on('callback_query', (callbackQuery: any) => { this.callbackQuery(callbackQuery) });

        // load chatroom and create clients
        this.loadChatrooms((chatrooms: Array<Chatroom>) => {
            this.chatrooms = chatrooms;
            const createdClients = this.createClients(this.chatrooms);
            let counter: number = 0;
            createdClients.forEach((createdClient) => {
                // indicate loaded just AND ONLY before greeting is sent
                if (counter === 0) loaded();
                counter += 1;
                this.emit('greeting', createdClient, () => {
                    this.bot.sendMessage(createdClient.id, 'Greeting Successful');
                });
            });
        });
    }

    message(msg: MsgInterface) {
        const chatId: number = msg.chat.id;
        this.fetchClientFromId(chatId, (client) => {
            if (this.isCommand(msg)) this.commandRequestIn(client, msg);
            else this.in(client, msg);
        });
    }

    out(relay: Relay, message: Message, callback: () => void): void {
        const newMessage = new Message(message.text);
        // create new message so that depracated versions of the message class
        // coming from the browser repo do not throw error
        this.bot.sendMessage(relay.to.id.toString(), newMessage.telegramFormat(relay.from), { parse_mode: 'HTML' }).then(() => {
            callback();
        });
    }

    commandOut(client: Client, response: Message, callback: () => void): void {
        this.bot.sendMessage(client.id.toString(), response.text).then(() => {
            callback();
        });
    }

    // load values from config files and create Chatroom classes out of
    // their corresponding values and return via callback (asynchronous)
    loadChatrooms(callback: (param: Array<Chatroom>) => void): void {
        const filePath = path.join(__dirname, '../', '../', 'chatroomList.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            const chatrooms: Array<Chatroom> = [];
            const json: any = JSON.parse(data);
            Object.keys(json).forEach((key: any) => {
                const id: number = parseInt(key);
                const name: string = json[key].name;
                const project: string = json[key].project;
                chatrooms.push(new Chatroom(id, name, project));
            });
            callback(chatrooms);
        });
    }

    isCommand(msg: MsgInterface): boolean {
        if (msg.entities && msg.entities[0].type === 'bot_command') return true;
        return false;
    }

    in(client: Client, msg: MsgInterface): void {
        this.emit('in', client, new Message(msg.text));
    }

    // turn and array of Chatroom classes into an array
    // of Client classes and return (synchronous)
    createClients(chatrooms: Array<Chatroom>): Array<Client> {
        const clients: Array<Client> = [];
        chatrooms.forEach(chatroom => {
            const client = new Client();
            client.setTelegram(chatroom.id, chatroom.name, chatroom.project);
            clients.push(client);
        });
        return clients;
    }

    commandKeyboard(client: Client,  command: any, msg: any, keyboard: Keyboard): void {
        const question: String = `Specify ${command}`;
        this.bot.sendMessage(client.id, question, {
            reply_markup: {
                inline_keyboard: keyboard.keyboard,
                one_time_keyboard: true,
            },
        }).then(() => {
            console.log('message sent');
        }).catch(console.error);
    }

    fetchClientFromId(chatId: number, callback: (client: Client) => void): void {
        this.emit('fetchClientFromId', chatId, (client: Client) => {
            callback(client);
        });
    }

    commandIn(client: Client, action: string): void {
        let command: string = action.replace(/^\//, '');
        client.setClosedCustomKeyboard();
        const params: Array<string> = command.split(' ');
        command = params[0];
        params.shift();
        this.emit('command-execution', client, command, params, (response: Message) => {
            this.commandOut(client, response, () => {
                console.log('commandout result');
            });
        });;
    }

    // TODO; typecheck msg
    commandRequestIn(client: Client, msg: any): void {
        let command: string = msg.text.replace(/^\//, '');
        client.setOpenCustomKeyboard();
        this.emit('command-initialization', client, command, (keyboard: Keyboard) => {
            this.commandKeyboard(client, command, msg, keyboard);
        });
    }

    callbackQuery(callbackQuery: any) {
        const action = callbackQuery.data;
        const chatId = callbackQuery.message.chat.id;
        this.fetchClientFromId(chatId, (client) => {
            if (client.custom_keyboard) {
                this.commandIn(client, action);
            } else {
                this.commandOut(client, new Message(''), () => {
                    console.log('command response', 'inline query not on, so callback query not expected');
                });
            }
        });
    }
}
