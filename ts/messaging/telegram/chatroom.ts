export default class Chatroom {
    id: number;
    name: string;
    project: string;
    constructor(id: number, name: string, project: string) {
        this.id = id;
        this.name = name;
        this.project = project;
    }
}
