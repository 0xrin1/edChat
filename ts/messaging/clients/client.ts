import Greeting from './greeting';
import Id from '../../utilities/id';
import RelayReference from '../relays/relayReference';

export default class Client implements Greeting {
    id: number;
    name: string;
    platform: string;
    project: string;
    ip: string;
    custom_keyboard: boolean;
    relays: RelayReference;
    date: Date;

    constructor(greeting?: Greeting) {
        if (!greeting) this.new();
        else this.set(greeting);
        this.relays = new RelayReference([], []);
    }

    new(): void {
        const clientId: Id = new Id();
        this.id = clientId.get();
        this.name = 'dummy';
        this.platform = 'dummy';
        this.project = 'dummy';
        this.date = new Date();
    }

    set(greeting: Greeting): void {
        this.id = greeting.id;
        this.name = greeting.name;
        this.platform = greeting.platform;
        this.project = greeting.project;
        this.date = greeting.date;
    }

    setTelegram(id: number, name: string, project: string): void {
        this.id = id;
        this.name = name;
        this.platform = 'telegram';
        this.project = project;
        this.custom_keyboard = false;
    }

    setBrowser(ip: string): void {
        this.ip = ip;
        this.custom_keyboard = false;
    }

    setOpenCustomKeyboard(): void {
        this.custom_keyboard = true;
    }

    setClosedCustomKeyboard(): void {
        this.custom_keyboard = false;
    }
}
