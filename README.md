# Collaborative Canvas 🎨

A real-time collaborative whiteboard application built using **Node.js**, **Socket.io**, and the **HTML5 Canvas API**.  
Multiple users can draw simultaneously on a shared canvas with instant synchronization.

---

## 🚀 Features

- 🎨 Draw using a brush tool (adjustable color and size)
- 🧽 Erase specific areas of the canvas
- ↩️ Global undo and redo (affects all users)
- 🧹 Clear the entire canvas
- ⚡ Real-time synchronization using WebSockets (Socket.io)
- 🧑‍🤝‍🧑 Multiple users can draw at the same time

---

## 🏗️ Tech Stack

| Component  | Technology |
|-----------|------------|
| Frontend  | HTML, CSS, JavaScript |
| Backend   | Node.js, Express, Socket.io |
| Hosting   | Render (Web Service + Static Site) |

---

## 📂 Project Structure

collaborative-canvas/
├── client/
│ ├── index.html
│ ├── style.css
│ ├── main.js
│ ├── canvas.js
│ └── websocket.js
├── server/
│ ├── server.js
│ ├── rooms.js
│ └── drawing-state.js
├── package.json
├── README.md
└── ARCHITECTURE.md


---

## ⚙️ Setup Instructions

### 1️⃣ Run Locally

```bash
# Clone the repository
git clone https://github.com/kusala22/canvas.git
cd collaborative-canvas

# Install dependencies
npm install

# Start the server
node server/server.js
2️⃣ Deploy to Render
Backend (Web Service)

Create a New Web Service

Build Command:

npm install


Start Command:

node server/server.js

Frontend (Static Site)

Create a New Static Site

Publish Directory:

client

🌐 Live Demo
👉 https://canvas-tt3e.onrender.com/

🧪 How to Test Real-Time Collaboration

Open the live link in two browser windows

Draw in one window

The drawing appears instantly in the other window

Test undo, redo, and clear actions

📄 Documentation

Architecture details are available in ARCHITECTURE.md

Covers:

Data flow

WebSocket protocol

Undo/Redo strategy

Conflict handling

Performance optimizations

⏱️ Time Spent

Approximately 2–4 days, including design, implementation, testing, and documentation.
