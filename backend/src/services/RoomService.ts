import { nanoid } from "nanoid";
import { User } from "./UserService.js";

interface Room {
    user1 : User;
    user2 : User;
}

export class RoomService {
    // stores id to room mapping
    private rooms: Map<string, Room>

    constructor() {
        this.rooms = new Map();
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generateRoomId();
        const room: Room = {
            user1,
            user2
        }
        this.rooms.set(roomId, room);
        console.log("Room created: ", roomId);
        user1.roomId = roomId;
        user2.roomId = roomId;

        // send room id to both users and set the offer sending and receiving party
        user1.socket.emit("send-offer", roomId);
        user2.socket.emit("receive-offer", roomId);
    }

    getRoom(id: string) {
        return this.rooms.get(id);
    }

    removeRoom(id: string) {
        this.rooms.delete(id);
    }

    generateRoomId() {
        return nanoid(10);
    }

    getOtherUser(roomId: string, socketId: string) {
        const room = this.getRoom(roomId);
        if(!room) {
            return null;
        }
        return room.user1.socket.id === socketId ? room.user2 : room.user1;
    }
}


