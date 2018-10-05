// Is this necessary?
interface EntitiesInterface {
    offset: number,
    length: number,
    type: string,
}

interface ChatInterface {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    type: string,
}

interface FromInterface {
    id: number,
    is_bot: boolean,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string,
}

export default interface MsgInterface {
    message_id: number,
    from: FromInterface,
    chat: ChatInterface,
    date: number,
    text: string,
    entities?: EntitiesInterface[],
}
