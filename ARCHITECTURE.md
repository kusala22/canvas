
---

### 🧩 **ARCHITECTURE.md**
```markdown
# Collaborative Canvas – Architecture Documentation

## 1. System Overview

This application follows a **client–server architecture** using **WebSockets
(Socket.io)** for real-time communication.

Multiple clients connect to a central Node.js server. The server acts as the
**single source of truth** for the shared canvas state and ensures that all users
see the same drawing in real time.

---

## 2. Client Architecture

The client is implemented using **native HTML5 Canvas API** without any drawing
libraries.

Two canvas layers are used:
- **Static Canvas** – renders all committed strokes
- **Live Canvas** – renders in-progress strokes and user cursors

This separation improves performance by avoiding full canvas redraws during
high-frequency pointer events.

The client is responsible for:
- Capturing pointer (mouse/touch) input
- Rendering strokes locally for instant feedback
- Sending drawing events to the server
- Rebuilding the canvas from server state when required

---

## 3. Server Architecture

The server is built using **Node.js, Express, and Socket.io**.

The server does not perform any drawing. Instead, it:
- Maintains an in-memory list of drawing strokes
- Handles WebSocket connections
- Broadcasts drawing updates to all connected clients
- Manages global undo and redo operations

This design keeps the server lightweight and deterministic.

---

## 4. Real-Time Data Flow

1. A user starts drawing on the canvas.
2. The client sends temporary stroke data (`stroke-temp`) to the server.
3. The server broadcasts this data to other connected clients for live rendering.
4. When the stroke is completed, the client sends the final stroke (`stroke-final`).
5. The server commits the stroke to the global history.
6. The updated canvas state is broadcast to all clients.

This ensures that drawings appear **while they are being drawn**, not after completion.

---

## 5. Drawing Data Model

Each drawing action is represented as a **vector-based stroke object**:

```json
{
  "id": "uuid",
  "tool": "brush | eraser",
  "color": "#000000",
  "size": 4,
  "points": [
    { "x": 120, "y": 240 },
    { "x": 122, "y": 242 }
  ]
}
---

## 6. Undo and Redo Strategy

Undo and redo operations are implemented **globally** across all users.

The server maintains:
- A stack of committed strokes
- A redo stack for undone strokes

### Undo Flow
- The most recent stroke is removed from the committed stroke stack
- The removed stroke is pushed onto the redo stack
- The updated canvas state is broadcast to all connected clients

### Redo Flow
- The most recent undone stroke is restored from the redo stack
- The restored stroke is added back to the committed stroke stack
- The updated canvas state is broadcast to all clients

Clients respond by clearing and redrawing the canvas from the updated stroke list,
ensuring that all users see the same state.

---

## 7. Conflict Handling

Multiple users are allowed to draw simultaneously on the same area of the canvas.

Conflicts are handled implicitly:
- Drawing actions are additive
- The server’s stroke ordering determines the final visual output
- No explicit locking or region ownership is enforced

This approach keeps the system simple while maintaining consistent behavior
across all clients.

---

## 8. Performance Considerations

Several optimizations are applied to ensure smooth real-time interaction:

- Pointer events are throttled before being sent over the network
- Temporary strokes are rendered immediately on the client for instant feedback
- Full canvas redraws occur only during undo, redo, clear, or initial sync
- High-DPI displays are handled using `devicePixelRatio` to avoid blurry rendering

These decisions balance responsiveness with network efficiency.

---

## 9. Deployment

The application is deployed as a **Node.js web service on Render**.

Render was chosen because it supports persistent WebSocket connections, which are
required for real-time collaboration using Socket.io.

Both the client and server are served from the same deployment to avoid
cross-origin and WebSocket connectivity issues.

---

## 10. Summary

This architecture prioritizes:
- Real-time collaboration
- Deterministic state synchronization
- Performance under high-frequency input
- Simplicity and clarity over over-engineering

The design ensures that all users share a consistent canvas state while maintaining
a smooth and responsive drawing experience.
