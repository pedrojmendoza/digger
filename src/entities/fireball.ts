import { FIREBALL_SPEED } from '../config';
import { DIRS } from '../types';
import type { Dir } from '../types';
import type { World } from '../world';

export class Fireball {
  alive = true;

  constructor(public x: number, public y: number, readonly dir: Dir) {}

  update(dt: number, world: World): void {
    this.x += DIRS[this.dir].x * FIREBALL_SPEED * dt;
    this.y += DIRS[this.dir].y * FIREBALL_SPEED * dt;
    const cx = Math.round(this.x);
    const cy = Math.round(this.y);
    if (!world.inBounds(cx, cy) || !world.dug[cy][cx] || world.bagAt(cx, cy)) this.alive = false;
  }
}
