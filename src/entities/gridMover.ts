import { DIRS, OPPOSITE } from '../types';
import type { Dir, Vec } from '../types';

/**
 * Moves one cell at a time between grid cells. Position is in cell units,
 * so the pixel position is (x * TILE, y * TILE).
 */
export class GridMover {
  /** Cell the entity is leaving (or standing in). */
  cx: number;
  cy: number;
  dir: Dir | null = null;
  /** 0..1 progress towards the next cell while moving. */
  progress = 0;
  facing: Dir = 'left';

  constructor(cx: number, cy: number) {
    this.cx = cx;
    this.cy = cy;
  }

  get x(): number {
    return this.cx + (this.dir ? DIRS[this.dir].x * this.progress : 0);
  }

  get y(): number {
    return this.cy + (this.dir ? DIRS[this.dir].y * this.progress : 0);
  }

  /** The cell the entity mostly occupies. */
  get cell(): Vec {
    if (this.dir && this.progress >= 0.5) {
      return { x: this.cx + DIRS[this.dir].x, y: this.cy + DIRS[this.dir].y };
    }
    return { x: this.cx, y: this.cy };
  }

  /** Turns around mid-move. */
  reverse(): void {
    if (!this.dir) return;
    this.cx += DIRS[this.dir].x;
    this.cy += DIRS[this.dir].y;
    this.dir = OPPOSITE[this.dir];
    this.facing = this.dir;
    this.progress = 1 - this.progress;
  }

  /**
   * Advances by `distance` cells. Whenever a cell is reached, `pick` chooses
   * the next direction (or null to stop). Leftover distance carries over.
   */
  protected advance(distance: number, pick: () => Dir | null): void {
    let remaining = distance;
    for (let guard = 0; guard < 4; guard++) {
      if (!this.dir) {
        const next = pick();
        if (!next) return;
        this.dir = next;
        this.facing = next;
        this.progress = 0;
      }
      const need = 1 - this.progress;
      if (remaining < need) {
        this.progress += remaining;
        return;
      }
      remaining -= need;
      this.cx += DIRS[this.dir].x;
      this.cy += DIRS[this.dir].y;
      this.dir = null;
      this.progress = 0;
      if (remaining <= 0) return;
    }
  }
}
