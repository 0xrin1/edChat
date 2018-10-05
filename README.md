# edChat

Nodejs server that provides a browser chatting infrastructure via socket.io that can be handled from an abstracted chat api.

## Purpose
Handles chat traffic for multiple sites, such that it can be monitored and responded to by a handful of people from their phones.

## Dependencies
This project uses TypeScript.
You can install TypeScript via npm.
```
npm i -g typescript
```

## Build
```
npm install
npm run tsc
```

## Run
```
npm run start
```

## Development
Watch ts files (requires global tsc installation):
```
npm run watch-ts
```

Run with nodemon (requires global installation):
```
npm run nodemon
```

```
npm run test
```

## Clarifications
The BrowserApi class interfaces with a socket-io client that can be connected without authentication (as it is meant to be an open protocol).
The ApiPort class interfaces with Telegram, a gratis chat client. You could use IRC or XMPP, doesn't really matter -- Telegram makes life relative easy though, which is why I used it for this implementation.

Note that telegram's api is provided through free virtual bots.
There is a main Bot Father that you add as a contact to your telegram list.
Add BotFather as a contact and start a conversation.
Botfather is essentially an in-client cli interface to the telegram chat api. Create a new bot through Botfather and once created add the bot to your friends list.
Now you have a chatid that edchat can interface with.

I highly recommend following these guides as it is counter intuitive the first time:
- https://core.telegram.org/bots // to create a new bot
- https://stackoverflow.com/a/32572159 // to get the chat ids that you need for this project's chatroomList.json file

## Architecture
Browser clients are powerless insofar as their behavior is hardcoded. Browser clients are the client-facing side of this chat infrastructure.
Api clients (telegram in this case) are the admin clients insofar as they would most likely be support, devops or something of the kind.
Browser clients do not have access to commands whereas api clients do.
Api clients can execute commands by writing them into the chat, preceding with a /.

Currently there are only 2 commands. /r and /u (see messaging/commands/commands.ts)
Command behavior can easily be extended without requiring rewrites.

The chat is essentially a typed map of relays that points different chat clients to each-other.

When an api client greets edChat, edChat creates a relay from that browser client to each admin client. This is so that any message that a browser client sends notifies all the admins, as you would want from a support team.

Admins can freely create relays, and as many as they like.
For instance, an admin can create a relay to herself to echo back messages.
Simply write /r in your Telegram chat with the bot that you hooked up to edChat and the bot will respond with a keyboard screen, giving you a list of touchable buttons, each with their corresponding chat client ids.

Currently this UI is somewhat limited because a high-traffic website would completely flood bot's response.
However, with a few extra commands the load could be distributed between admins to increase efficiency. It is also really nice to be able to click the relay that you want to create instead of typing in a command with a long id name.

## Get Started
Build.
Create a chatroomList.json file in the root directory.
Add telegram keys in the following format:
```
{
    "123456789": {
        "name": "Wolfgang",
        "project": "Wolfgang's portfolio page"
    },
    // "telegram chatroom id": {
    //     "name": "Name",
    //     "project": "Project description"
    // },
    // ...
}
```
I recommend running it with pm2 since I still can't guarantee that it will not crash.
```
node prod/app.js // if you don't want restart on codechange or crash
or
nodemon prod/app.js // if you want restart on codechange but not crash
or
pm2 prod/app.js // if you want restart on codechange and crash
```

