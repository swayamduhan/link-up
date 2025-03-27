import { Socket } from "socket.io";
import { RoomService } from "./RoomService.js";


export interface User {
    socket: Socket;
    id: number; // random user id generated for user, can be removed lol
}

export class UserService {
    // users array stores all connected users
    // queue stores currently waiting users to be matched
    private users : User[]
    private queue: User[]
    private roomService: RoomService
    
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomService = new RoomService();
    }

    addUser(socket: Socket, id: number) {
        console.log("User with socket id: ", socket.id, " added to queue and users array");
        const user = { socket, id };
        this.users.push(user);
        this.queue.push(user);
        this.matchUsersFromQueue();
    }

    getUser(id: number) {
        return this.users.find(user => user.id === id);
    }

    removeUser(socket: Socket) {
        // remove user from users and queue
        this.users = this.users.filter(user => user.socket !== socket);
        this.queue = this.queue.filter(user => user.socket !== socket);
        console.log("User with socket id: ", socket.id, " disconnected");

        // take left user from room and back to queue
        const connectedRoom = this.roomService.getRoomByUserSocketId(socket.id);
        if(connectedRoom) {
            const leftUser = connectedRoom.users.find(user => user.socket !== socket);
            if(leftUser) {
                this.queue.push(leftUser);
                console.log("User left in room with socket id: ", leftUser.socket.id, " added back to queue");
            }
            this.roomService.removeRoom(connectedRoom.id);
            console.log("Room with id: ", connectedRoom.id, " removed");
        }
        this.matchUsersFromQueue();
    }
    
    matchUsersFromQueue() {
        if (this.queue.length < 2) {
            return;
        }
        const user1 = this.queue.shift();
        const user2 = this.queue.shift();

        if(!user1 || !user2) {
            console.error("User not found");
            return;
        }
        console.log("Users matched: ", user1.socket.id, " and ", user2.socket.id);
        this.roomService.createRoom(user1, user2);
    }
}
