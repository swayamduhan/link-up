import { Socket } from "socket.io";

interface User {
    socket: Socket;
    id: string;
}

export class UserService {
    private users : User[]
    private queue: User[]
    
    constructor() {
        this.users = [];
        this.queue = [];
    }

    addUser(socket: Socket, id: string) {
        const user = { socket, id };
        this.users.push(user);
    }

}
