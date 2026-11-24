import type { Dir } from './types';

export type Action = 'start' | 'fire' | 'pause';

const DIR_KEYS: Record<string, Dir> = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
};

const ACTION_KEYS: Record<string, Action> = {
  Enter: 'start',
  Space: 'fire',
  KeyF: 'fire',
  KeyP: 'pause',
};

export class Input {
  private held: Dir[] = []; // most recently pressed direction is last
  private pressed = new Set<Action>();

  constructor(target: Window) {
    target.addEventListener('keydown', (e) => {
      const dir = DIR_KEYS[e.code];
      if (dir) {
        e.preventDefault();
        this.held = this.held.filter((d) => d !== dir);
        this.held.push(dir);
        return;
      }
      const action = ACTION_KEYS[e.code];
      if (action) {
        e.preventDefault();
        if (!e.repeat) this.pressed.add(action);
      }
    });
    target.addEventListener('keyup', (e) => {
      const dir = DIR_KEYS[e.code];
      if (dir) this.held = this.held.filter((d) => d !== dir);
    });
    target.addEventListener('blur', () => {
      this.held = [];
      this.pressed.clear();
    });
  }

  /** The direction the player is currently asking for, if any. */
  get direction(): Dir | null {
    return this.held.length ? this.held[this.held.length - 1] : null;
  }

  /** True once per key press. */
  consume(action: Action): boolean {
    return this.pressed.has(action);
  }

  /** Call once at the end of every update. */
  endFrame(): void {
    this.pressed.clear();
  }
}
