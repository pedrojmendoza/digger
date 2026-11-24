import { PLAYER_SPEED } from '../config';
import { DIRS, OPPOSITE } from '../types';
import type { Dir } from '../types';
import type { World } from '../world';
import { GridMover } from './gridMover';

export class Player extends GridMover {
  update(dt: number, want: Dir | null, world: World): void {
    if (want && this.dir === OPPOSITE[want]) this.reverse();
    if (want && !this.dir) this.facing = want; // lets the player aim at a wall
    this.advance(PLAYER_SPEED * dt, () => (want && this.tryEnter(world, want) ? want : null));
  }

  /** Checks the next cell is open. Pushes a bag sideways if there is room. */
  private tryEnter(world: World, dir: Dir): boolean {
    const v = DIRS[dir];
    const nx = this.cx + v.x;
    const ny = this.cy + v.y;
    if (!world.inBounds(nx, ny)) return false;

    const bag = world.bagAt(nx, ny);
    if (!bag) return true;
    if (bag.state !== 'idle' || v.y !== 0) return false;

    const bx = nx + v.x;
    if (!world.inBounds(bx, ny) || !world.dug[ny][bx] || world.bagAt(bx, ny)) return false;
    bag.push(v.x);
    return true;
  }
}
