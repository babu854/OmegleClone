"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(user1, user2) {
        console.log('inside create room');
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2
        });
        user1 === null || user1 === void 0 ? void 0 : user1.socket.emit("send-offer", {
            roomId
        });
        user2 === null || user2 === void 0 ? void 0 : user2.socket.emit("send-offer", {
            roomId
        });
    }
    //////user left////////
    // deleteRoom(rooomId){
    //     this.rooms = this.rooms.f
    // }
    onOffer(roomId, sdp, senderSocketid, name) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("offer", {
            sdp,
            roomId,
            name
        });
    }
    onAnswer(roomId, sdp, senderSocketid, name) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("answer", {
            sdp,
            roomId,
            name
        });
    }
    onIceCandidates(roomId, senderSocketid, candidate, type, name) {
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
exports.RoomManager = RoomManager;
