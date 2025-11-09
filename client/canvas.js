// client/canvas.js
export function attachCanvasHandlers(socket) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // toolbar elements
  const brushBtn = document.getElementById("brush");
  const eraserBtn = document.getElementById("eraser");
  const colorInput = document.getElementById("color");
  const sizeInput = document.getElementById("size");
  const undoBtn = document.getElementById("undo");
  const redoBtn = document.getElementById("redo");
  const clearBtn = document.getElementById("clear");
  const userCountSpan = document.getElementById("userCount");

  let tool = "brush";
  let color = colorInput.value;
  let size = Number(sizeInput.value);

  let drawing = false;
  let currentPoints = []; 

  let committedStrokes = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    redrawCommitted();
  }

  // call on load and on resize
  setTimeout(resize, 50);
  window.addEventListener("resize", () => {
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(resize, 120);
  });

  // UI wiring
  brushBtn.onclick = () => setTool("brush");
  eraserBtn.onclick = () => setTool("eraser");
  colorInput.oninput = (e) => (color = e.target.value);
  sizeInput.oninput = (e) => (size = Number(e.target.value));
  undoBtn.onclick = () => socket.emit("undo");
  redoBtn.onclick = () => socket.emit("redo");
  clearBtn.onclick = () => socket.emit("clear");

  function setTool(t) {
    tool = t;
    brushBtn.classList.toggle("active", t === "brush");
    eraserBtn.classList.toggle("active", t === "eraser");
  }

  // get pointer position relative to canvas (CSS pixels)
  function posFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function pointerDown(e) {
    e.preventDefault();
    drawing = true;
    currentPoints = [];
    const p = posFromEvent(e);
    currentPoints.push(p);

    socket.emit("stroke-temp", { tool, color, size, points: [p] });
  }

  function pointerMove(e) {
    if (!drawing) return;
    const p = posFromEvent(e);
    currentPoints.push(p);

    if (currentPoints.length % 4 === 0) {
      socket.emit("stroke-temp", { tool, color, size, points: currentPoints.slice(-8) });
    }

    drawSegmentImmediate({ tool, color, size, points: currentPoints.slice(-2) });
  }

  function pointerUp(e) {
    if (!drawing) return;
    drawing = false;
    const p = posFromEvent(e);
    currentPoints.push(p);

    const stroke = { tool, color, size, points: currentPoints.slice() };
    socket.emit("stroke-final", stroke);
    currentPoints = [];
  }

  function drawSegmentImmediate(stroke) {
    if (!stroke.points || stroke.points.length < 2) return;
    ctx.save();
    if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
    }
    ctx.lineWidth = stroke.size;
    ctx.lineCap = "round";
    ctx.beginPath();
    const pts = stroke.points;
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
    ctx.restore();
  }

  function redrawCommitted() {
    ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
    for (const s of committedStrokes) {
      drawFullStroke(s);
    }
  }
  function drawFullStroke(stroke) {
    if (!stroke.points || stroke.points.length < 2) return;
    ctx.save();
    if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
    }
    ctx.lineWidth = stroke.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const pts = stroke.points;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  socket.on("stroke-temp", ({ id, temp }) => {
    drawSegmentImmediate(temp);
  });

  socket.on("canvas-state", (strokes) => {
    committedStrokes = strokes.slice();
    redrawCommitted();
  });

  socket.on("userCount", (n) => {
    userCountSpan.textContent = n;
  });
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerUp);
  canvas.addEventListener("pointerleave", pointerUp);

  return {
    redrawCommitted,
    drawFullStroke,
  };
}
