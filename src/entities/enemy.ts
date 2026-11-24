import { COLS, ROWS } from '../config';
import { DIRS, OPPOSITE } from '../types';
import type { Dir, Vec } from '../types';
import type { World } from '../world';
import { GridMover } from './gridMover';

const ALL_DIRS: Dir[] = ['up', 'down', 'left', 'right'];

/** A Nobbin: stays in tunnels and chases the player along the shortest path. */
export class Enemy extends GridMover {
  alive = true;

  constructor(cx: number, cy: number, readonly speed: number) {
    super(cx, cy);
  }

  update(dt: number, world: World, target: Vec): void {
    this.advance(this.speed * dt, () => this.chooseDir(world, target));
  }

  private open(world: World, x: number, y: number): boolean {
    return world.inBounds(x, y) && world.dug[y][x] && !world.bagAt(x, y);
  }

  private chooseDir(world: World, target: Vec): Dir | null {
    const path = this.firstStepTowards(world, target);
    if (path) return path;

    // No route to the player: wander, avoiding turning back when possible.
    const options = ALL_DIRS.filter((d) => this.open(world, this.cx + DIRS[d].x, this.cy + DIRS[d].y));
    const forward = options.filter((d) => d !== OPPOSITE[this.facing]);
    const pool = forward.length ? forward : options;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  /** Breadth-first search over open tunnel cells. */
  private firstStepTowards(world: World, target: Vec): Dir | null {
    if (target.x === this.cx && target.y === this.cy) return null;
    const first: (Dir | undefined)[] = new Array(ROWS * COLS).fill(undefined);
    const seen = new Array<boolean>(ROWS * COLS).fill(false);
    const queue: Vec[] = [{ x: this.cx, y: this.cy }];
    seen[this.cy * COLS + this.cx] = true;

    for (let head = 0; head < queue.length; head++) {
      const cur = queue[head];
      for (const d of ALL_DIRS) {
        const nx = cur.x + DIRS[d].x;
        const ny = cur.y + DIRS[d].y;
        if (!this.open(world, nx, ny) || seen[ny * COLS + nx]) continue;
        seen[ny * COLS + nx] = true;
        first[ny * COLS + nx] = first[cur.y * COLS + cur.x] ?? d;
        if (nx === target.x && ny === target.y) return first[ny * COLS + nx] ?? null;
        queue.push({ x: nx, y: ny });
      }
    }
    return null;
  }
}
