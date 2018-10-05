"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const client_1 = require("./clients/client");
const message_1 = require("./router/message");
const chatroom_1 = require("./telegram/chatroom");
class ApiPort extends events.EventEmitter {
    constructor(tgKey, loaded) {
        super();
        this.bot = new TelegramBot(tgKey, { polling: true });
        this.bot.on('message', (msg) => { this.message(msg); });
        this.bot.on('polling_error', (error) => { console.log('polling error', error); });
        this.bot.on('callback_query', (callbackQuery) => { this.callbackQuery(callbackQuery); });
        this.loadChatrooms((chatrooms) => {
            this.chatrooms = chatrooms;
            const createdClients = this.createClients(this.chatrooms);
            let counter = 0;
            createdClients.forEach((createdClient) => {
                if (counter === 0)
                    loaded();
                counter += 1;
                this.emit('greeting', createdClient, () => {
                    this.bot.sendMessage(createdClient.id, 'Greeting Successful');
                });
            });
        });
    }
    message(msg) {
        const chatId = msg.chat.id;
        this.fetchClientFromId(chatId, (client) => {
            if (this.isCommand(msg))
                this.commandRequestIn(client, msg);
            else
                this.in(client, msg);
        });
    }
    out(relay, message, callback) {
        const newMessage = new message_1.default(message.text);
        this.bot.sendMessage(relay.to.id.toString(), newMessage.telegramFormat(relay.from), { parse_mode: 'HTML' }).then(() => {
            callback();
        });
    }
    commandOut(client, response, callback) {
        this.bot.sendMessage(client.id.toString(), response.text).then(() => {
            callback();
        });
    }
    loadChatrooms(callback) {
        const filePath = path.join(__dirname, '../', '../', 'chatroomList.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err)
                throw err;
            const chatrooms = [];
            const json = JSON.parse(data);
            Object.keys(json).forEach((key) => {
                const id = parseInt(key);
                const name = json[key].name;
                const project = json[key].project;
                chatrooms.push(new chatroom_1.default(id, name, project));
            });
            callback(chatrooms);
        });
    }
    isCommand(msg) {
        if (msg.entities && msg.entities[0].type === 'bot_command')
            return true;
        return false;
    }
    in(client, msg) {
        this.emit('in', client, new message_1.default(msg.text));
    }
    createClients(chatrooms) {
        const clients = [];
        chatrooms.forEach(chatroom => {
            const client = new client_1.default();
            client.setTelegram(chatroom.id, chatroom.name, chatroom.project);
            clients.push(client);
        });
        return clients;
    }
    commandKeyboard(client, command, msg, keyboard) {
        const question = `Specify ${command}`;
        this.bot.sendMessage(client.id, question, {
            reply_markup: {
                inline_keyboard: keyboard.keyboard,
                one_time_keyboard: true,
            },
        }).then(() => {
            console.log('message sent');
        }).catch(console.error);
    }
    fetchClientFromId(chatId, callback) {
        this.emit('fetchClientFromId', chatId, (client) => {
            callback(client);
        });
    }
    commandIn(client, action) {
        let command = action.replace(/^\//, '');
        client.setClosedCustomKeyboard();
        const params = command.split(' ');
        command = params[0];
        params.shift();
        this.emit('command-execution', client, command, params, (response) => {
            this.commandOut(client, response, () => {
                console.log('commandout result');
            });
        });
        ;
    }
    commandRequestIn(client, msg) {
        let command = msg.text.replace(/^\//, '');
        client.setOpenCustomKeyboard();
        this.emit('command-initialization', client, command, (keyboard) => {
            this.commandKeyboard(client, command, msg, keyboard);
        });
    }
    callbackQuery(callbackQuery) {
        const action = callbackQuery.data;
        const chatId = callbackQuery.message.chat.id;
        this.fetchClientFromId(chatId, (client) => {
            if (client.custom_keyboard) {
                this.commandIn(client, action);
            }
            else {
                this.commandOut(client, new message_1.default(''), () => {
                    console.log('command response', 'inline query not on, so callback query not expected');
                });
            }
        });
    }
}
exports.default = ApiPort;
//# sourceMappingURL=apiPort.js.map