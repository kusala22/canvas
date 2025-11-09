const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = 500;

let drawing = false;
let strokes = [];
let currentStroke = [];
let color = document.getElementById("colorPicker").value;
let size = document.getElementById("brushSize").value;

// Update color & brush size
document.getElementById("colorPicker").onchange = (e) => (color = e.target.value);
document.getElementById("brushSize").oninput = (e) => (size = e.target.value);


canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  currentStroke = [];
  draw(e);
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  draw(e);
  socket.emit("stroke-temp", { color, size, stroke: currentStroke });
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  socket.emit("stroke-final", { color, size, stroke: currentStroke });
  currentStroke = [];
});

function draw(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  currentStroke.push({ x, y });

  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = "round";

  if (currentStroke.length > 1) {
    const prev = currentStroke[currentStroke.length - 2];
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function redraw(allStrokes) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of allStrokes) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.size;
    ctx.lineCap = "round";
    for (let i = 1; i < s.stroke.length; i++) {
      const p1 = s.stroke[i - 1];
      const p2 = s.stroke[i];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
}

// Button actions
document.getElementById("undo").onclick = () => socket.emit("undo");
document.getElementById("redo").onclick = () => socket.emit("redo");
document.getElementById("clear").onclick = () => socket.emit("clear");


socket.on("canvas-state", (allStrokes) => {
  strokes = allStrokes;
  redraw(strokes);
});

socket.on("stroke-temp", ({ temp }) => {
  redraw(strokes);
  const s = temp;
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.size;
  for (let i = 1; i < s.stroke.length; i++) {
    const p1 = s.stroke[i - 1];
    const p2 = s.stroke[i];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
});

socket.on("userCount", (count) => {
  document.getElementById("userCount").textContent = `Users: ${count}`;
});
