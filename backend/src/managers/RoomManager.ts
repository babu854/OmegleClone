import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1;
interface Room {
    user1: User,
    user2: User
}
export class RoomManager {
    private rooms: Map<string, Room>
    constructor() {
        this.rooms = new Map<string, Room>()
    }
    createRoom(user1: User, user2: User) {
        console.log('inside create room')
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2
        })

        user1?.socket.emit("send-offer", {
            roomId
        })
        user2?.socket.emit("send-offer", {
            roomId
        })
    }
    //////user left////////
    // deleteRoom(rooomId){
    //     this.rooms = this.rooms.f
    // }
    onOffer(roomId: string, sdp: string, senderSocketid: string, name: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser?.socket.emit("offer", {
            sdp,
            roomId,
            name
        })
    }

    onAnswer(roomId: string, sdp: string, senderSocketid: string, name: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;

        receivingUser?.socket.emit("answer", {
            sdp,
            roomId,
            name
        });
    }

    onIceCandidates(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver", name: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser.socket.emit("add-ice-candidate", ({ candidate, type, name }));
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
}