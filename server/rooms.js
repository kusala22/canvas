import { DrawingState } from "./drawing-state.js";

const rooms = new Map();

export function ensureRoom(roomName) {
  if (!rooms.has(roomName)) {
    rooms.set(roomName, { users: new Set(), state: new DrawingState() });
  }
  return rooms.get(roomName);
}

export function removeRoomIfEmpty(roomName) {
  const room = rooms.get(roomName);
  if (room && room.users.size === 0) {
    rooms.delete(roomName);
  }
}
