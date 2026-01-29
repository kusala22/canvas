import { createSocket } from "./websocket.js";
import { attachCanvasHandlers } from "./canvas.js";

const socket = createSocket();
attachCanvasHandlers(socket);
