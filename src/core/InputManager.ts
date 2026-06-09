export class InputManager {
  keys: Record<string, boolean> = {};
  mouse = { x: 0, y: 0, dx: 0, dy: 0 };
  locked = false;
  canvas: HTMLElement;
  onPointerLockChange?: (locked: boolean) => void;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;

    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Escape' && this.locked) {
        document.exitPointerLock();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('click', () => {
      if (!this.locked) {
        canvas.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      this.onPointerLockChange?.(this.locked);
    });

    document.addEventListener('mousemove', (e) => {
      if (this.locked) {
        this.mouse.dx += e.movementX;
        this.mouse.dy += e.movementY;
      }
    });

    canvas.addEventListener('wheel', (e) => {
      this.mouse.y += e.deltaY * 0.01;
    }, { passive: true });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isDown(code: string): boolean {
    return !!this.keys[code];
  }

  consumeMouseDelta() {
    const dx = this.mouse.dx;
    const dy = this.mouse.dy;
    this.mouse.dx = 0;
    this.mouse.dy = 0;
    return { dx, dy };
  }

  getScrollDelta(): number {
    const y = this.mouse.y;
    this.mouse.y = 0;
    return y;
  }
}
