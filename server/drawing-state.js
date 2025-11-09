export class DrawingState {
  constructor() {
    this.strokes = [];
    this.redoStack = [];
  }

  getAll() {
    return this.strokes;
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
    this.redoStack = []; // reset redo stack when new stroke added
    return this.strokes;
  }

  undo() {
    if (this.strokes.length > 0) {
      const last = this.strokes.pop();
      this.redoStack.push(last);
    }
    return this.strokes;
  }

  redo() {
    if (this.redoStack.length > 0) {
      const stroke = this.redoStack.pop();
      this.strokes.push(stroke);
    }
    return this.strokes;
  }

  clear() {
    this.strokes = [];
    this.redoStack = [];
    return this.strokes;
  }
}
