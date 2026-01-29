import { DrawingState } from "./drawing-state.js";

const rooms = new Map();

export function getRoom(name) {
  if (!rooms.has(name)) {
    rooms.set(name, {
      users: new Set(),
      state: new DrawingState()
    });
  }
  return rooms.get(name);
}
