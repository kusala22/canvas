
---

### 🧩 **ARCHITECTURE.md**
```markdown
# Collaborative Canvas – Architecture Overview

## 🏗️ System Design
The app uses a **client-server** architecture powered by **Socket.io** for real-time communication.

---

## ⚙️ Components

### 1️⃣ Frontend (Client)
- Built using **HTML Canvas API**
- Handles:
  - Drawing, erasing, and color/size control
  - Undo, redo, and clear operations
  - Sending draw events to server via Socket.io
- Receives updates from other users in real time

### 2️⃣ Backend (Server)
- Built on **Node.js + Express**
- Handles:
  - WebSocket connections using **Socket.io**
  - Broadcasting draw events to all connected clients
- No persistent storage (in-memory only)

---

## 🔁 Data Flow
1. User draws → client emits event (`draw`, `erase`, etc.) to server  
2. Server receives event → broadcasts to all connected clients  
3. All clients update canvas in real-time  

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|--------|------------|--------------|
| `draw` | client → server → others | Sends drawing coordinates |
| `erase` | client → server → others | Sends erase coordinates |
| `undo` | client → server → others | Undo last action |
| `redo` | client → server → others | Redo last undone action |
| `clear` | client → server → all | Clears the entire canvas |

---

## 🧱 Deployment
### Render Setup:
- **Backend:** Web Service → `node server.js`  
- **Frontend:** Static Site → `/client` folder  
- Both are connected via Socket.io using the backend's deployed URL.

---

## 🔒 Future Enhancements
- Save canvas drawings to cloud storage
- User authentication for private boards
- Collaborative drawing rooms (multi-session)
- Chat integration
