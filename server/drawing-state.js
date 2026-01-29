export class DrawingState {
  constructor() {
    this.strokes = [];
    this.redoStack = [];
  }

  commit(stroke) {
    this.strokes.push(stroke);
    this.redoStack = [];
    return this.strokes;
  }

  undo() {
    if (this.strokes.length) {
      this.redoStack.push(this.strokes.pop());
    }
    return this.strokes;
  }

  redo() {
    if (this.redoStack.length) {
      this.strokes.push(this.redoStack.pop());
    }
    return this.strokes;
  }

  clear() {
    this.strokes = [];
    this.redoStack = [];
    return this.strokes;
  }
}
