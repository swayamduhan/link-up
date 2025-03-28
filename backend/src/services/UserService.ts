import { Socket } from "socket.io";
import { RoomService } from "./RoomService.js";


export interface User {
    socket: Socket;
    id: number; // random user id generated for user, can be removed lol
    roomId: string | null;
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
        const user = { socket, id, roomId: null };
        this.users.push(user);
        this.queue.push(user);
        this.initSocketHandlers(socket);
        this.matchUsersFromQueue();
    }

    getUser(id: number) {
        return this.users.find(user => user.id === id);
    }

    getUserBySocketId(socketId: string) {
        return this.users.find(user => user.socket.id === socketId);
    }

    removeUser(socket: Socket) {
        // remove user from users and queue
        const user = this.getUserBySocketId(socket.id);
        this.users = this.users.filter(x => x.socket.id != socket.id);
        this.queue = this.queue.filter(x => x.socket.id != socket.id);
        console.log("User with socket id: ", socket.id, " disconnected");

        if(!user?.roomId) {
            return;
        }
        
        // take left user from room and back to queue
        const connectedRoom = this.roomService.getRoom(user.roomId);
        if(connectedRoom) {
            const leftUser = this.roomService.getOtherUser(user.roomId, socket.id);
            if(leftUser) {
                this.queue.push(leftUser);
                console.log("User left in room with socket id: ", leftUser.socket.id, " added back to queue");
            }
            this.roomService.removeRoom(user.roomId);
            console.log("Room with id: ", user.roomId, " removed");
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


    // initialize socket handlers for user, to use as signalling server
    initSocketHandlers(socket: Socket) {
        socket.on("offer", ({ sdp, roomId } : any) => {
            const user = this.roomService.getOtherUser(roomId, socket.id);
            if(!user) {
                console.error("User not found");
                return;
            }
            user.socket.emit("offer", { sdp });
        })

        socket.on("answer", ({ sdp, roomId } : any) => {
            const user = this.roomService.getOtherUser(roomId, socket.id);
            if(!user) {
                console.error("User not found");
                return;
            }

            user.socket.emit("answer", { sdp });
        })

        socket.on("add_ice_candidate", ({ candidate, roomId, type } : any) => {
            const user = this.roomService.getOtherUser(roomId, socket.id);
            if(!user) {
                console.error("User not found");
                return;
            }

            user.socket.emit("add_ice_candidate", { candidate, type });
        })
    }
}