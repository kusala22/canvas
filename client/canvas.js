export function attachCanvasHandlers(socket) {
  const staticCanvas = document.getElementById("canvas-static");
  const liveCanvas = document.getElementById("canvas-live");
  const wrapper = document.querySelector(".canvas-wrapper");

  const sCtx = staticCanvas.getContext("2d");
  const lCtx = liveCanvas.getContext("2d");

  liveCanvas.style.touchAction = "none";

  const brushBtn = document.getElementById("brush");
  const eraserBtn = document.getElementById("eraser");
  const colorInput = document.getElementById("color");
  const sizeInput = document.getElementById("size");
  const undoBtn = document.getElementById("undo");
  const redoBtn = document.getElementById("redo");
  const clearBtn = document.getElementById("clear");
  const userCount = document.getElementById("userCount");

  let tool = "brush";
  let color = colorInput.value;
  let size = Number(sizeInput.value);
  let drawing = false;
  let currentPoints = [];
  let committedStrokes = [];
  let lastEmit = 0;

  // 👻 ghost cursors
  const cursors = new Map();

  function resizeCanvas() {
    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    [staticCanvas, liveCanvas].forEach(canvas => {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    });

    redrawCommitted();
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function getPos(e) {
    const r = wrapper.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // ✨ smooth curve drawing
  function drawStroke(ctx, stroke) {
    const pts = stroke.points;
    if (pts.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = stroke.size;
    ctx.strokeStyle = stroke.color;
    ctx.globalCompositeOperation =
      stroke.tool === "eraser" ? "destination-out" : "source-over";

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);

    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }

    ctx.stroke();
    ctx.restore();
  }

  function redrawCommitted() {
    sCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
    committedStrokes.forEach(s => drawStroke(sCtx, s));
  }

  function drawCursors() {
    cursors.forEach(p => {
      lCtx.beginPath();
      lCtx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      lCtx.fillStyle = "rgba(0,0,255,0.7)";
      lCtx.fill();
    });
  }

  liveCanvas.onpointerdown = e => {
    drawing = true;
    currentPoints = [getPos(e)];
    liveCanvas.setPointerCapture(e.pointerId);
  };

  liveCanvas.onpointermove = e => {
    const p = getPos(e);

    // send cursor position
    socket.emit("cursor", p);

    if (!drawing) {
      lCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
      lCtx.beginPath();
      lCtx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      lCtx.strokeStyle = "rgba(0,0,0,0.3)";
      lCtx.stroke();
      drawCursors();
      return;
    }

    currentPoints.push(p);

    drawStroke(lCtx, {
      tool,
      color,
      size,
      points: currentPoints.slice(-4)
    });

    const now = performance.now();
    if (now - lastEmit > 16) {
      socket.emit("stroke-temp", {
        tool,
        color,
        size,
        points: currentPoints.slice(-6)
      });
      lastEmit = now;
    }
  };

  liveCanvas.onpointerup = () => {
    if (!drawing) return;
    drawing = false;

    socket.emit("stroke-final", {
      id: crypto.randomUUID(),
      tool,
      color,
      size,
      points: currentPoints
    });

    currentPoints = [];
    lCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
  };

  brushBtn.onclick = () => {
    tool = "brush";
    brushBtn.classList.add("active");
    eraserBtn.classList.remove("active");
  };

  eraserBtn.onclick = () => {
    tool = "eraser";
    eraserBtn.classList.add("active");
    brushBtn.classList.remove("active");
  };

  colorInput.oninput = e => (color = e.target.value);
  sizeInput.oninput = e => (size = Number(e.target.value));
  undoBtn.onclick = () => socket.emit("undo");
  redoBtn.onclick = () => socket.emit("redo");
  clearBtn.onclick = () => socket.emit("clear");

  socket.on("stroke-temp", stroke => {
    drawStroke(lCtx, stroke);
  });

  socket.on("canvas-state", strokes => {
    committedStrokes = strokes;
    redrawCommitted();
    lCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
  });

  socket.on("cursor", ({ id, pos }) => {
    cursors.set(id, pos);
    setTimeout(() => cursors.delete(id), 80);
  });

  socket.on("userCount", n => (userCount.textContent = n));
}
