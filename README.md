# Collaborative Canvas 🎨

A real-time collaborative whiteboard app built using **Socket.io**, **Node.js**, and **HTML Canvas**.

---

## 🚀 Features
- 🎨 Draw using brush tool (adjust color and size)
- 🧽 Erase specific areas
- ↩️ Undo & Redo drawing actions
- 🧹 Clear the entire canvas
- ⚡ Real-time sync across multiple users via Socket.io
- 🧑‍🤝‍🧑 Multiple users can draw simultaneously

---

## 🏗️ Tech Stack
| Component | Technology |
|------------|-------------|
| Frontend   | HTML, CSS, JavaScript |
| Backend    | Node.js, Express, Socket.io |
| Hosting    | Render (Static + Web Service) |

---

## 📂 Project Structure
collaborative-canvas/
├── client/
│ ├── index.html
│ ├── style.css
│ ├── script.js
│
├── server.js
├── package.json
├── README.md
└── ARCHITECTURE.md

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Run Locally
```bash
# Clone repository
git clone https://github.com/your-username/collaborative-canvas.git
cd collaborative-canvas

# Install dependencies
npm install

# Start backend
node server.js
Then open client/index.html in your browser.

2️⃣ Deploy to Render
Backend:

New → Web Service

Build Command: npm install

Start Command: node server.js

Frontend:

New → Static Site

Publish Directory: /client

🌐 Live Demo
👉 https://collaborative-canvas-rlzj.onrender.com/