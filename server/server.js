import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ensureRoom, removeRoomIfEmpty } from "./rooms.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
  const room = ensureRoom("main");
  room.users.add(socket.id);
  console.log(`User connected: ${socket.id}`);
  io.emit("userCount", room.users.size);

  socket.emit("canvas-state", room.state.getAll());
  socket.on("stroke-temp", (temp) => {
    socket.broadcast.emit("stroke-temp", { id: socket.id, temp });
  });

  socket.on("stroke-final", (stroke) => {
    const newState = room.state.addStroke(stroke);
    io.emit("canvas-state", newState);
  });

  socket.on("undo", () => {
    const newState = room.state.undo();
    io.emit("canvas-state", newState);
  });

  socket.on("redo", () => {
    const newState = room.state.redo();
    io.emit("canvas-state", newState);
  });

  socket.on("clear", () => {
    const newState = room.state.clear();
    io.emit("canvas-state", newState);
  });

  socket.on("disconnect", () => {
    room.users.delete(socket.id);
    io.emit("userCount", room.users.size);
    removeRoomIfEmpty("main");
    console.log(`Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
