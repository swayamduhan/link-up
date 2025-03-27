import { User } from "./UserService.js";

interface Room {
    id: string;
    users: User[];
}

export class RoomService {
    private rooms: Room[]

    constructor() {
        this.rooms = [];
    }

    createRoom(user1: User, user2: User) {
        const room: Room = {
            id: `${user1.id}-${user2.id}`,
            users: [user1, user2]
        }
        this.rooms.push(room);
        console.log("Room created: ", room.id);
    }

    getRoom(id: string) {
        return this.rooms.find(room => room.id === id);
    }

    getRoomByUserSocketId(socketId: string) {
        return this.rooms.find(room => room.users.some(user => user.socket.id === socketId));
    }

    removeRoom(id: string) {
        this.rooms = this.rooms.filter(room => room.id !== id);
    }
}


