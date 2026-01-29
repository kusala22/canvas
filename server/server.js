import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getRoom } from "./rooms.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", socket => {
  const room = getRoom("main");
  room.users.add(socket.id);

  io.emit("userCount", room.users.size);
  socket.emit("canvas-state", room.state.strokes);

  socket.on("stroke-temp", stroke => {
    socket.broadcast.emit("stroke-temp", stroke);
  });

  socket.on("stroke-final", stroke => {
    io.emit("canvas-state", room.state.commit(stroke));
  });

  socket.on("undo", () => {
    io.emit("canvas-state", room.state.undo());
  });

  socket.on("redo", () => {
    io.emit("canvas-state", room.state.redo());
  });

  socket.on("clear", () => {
    io.emit("canvas-state", room.state.clear());
  });

  socket.on("disconnect", () => {
    room.users.delete(socket.id);
    io.emit("userCount", room.users.size);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
