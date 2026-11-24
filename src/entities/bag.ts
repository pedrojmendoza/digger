import { BAG_BREAK_HEIGHT, BAG_FALL_SPEED, BAG_WOBBLE_TIME, PLAYER_SPEED, ROWS } from '../config';
import type { World } from '../world';

export type BagState = 'idle' | 'wobble' | 'fall' | 'broken';

export class Bag {
  state: BagState = 'idle';
  /** Fractional progress (0..1) towards the cell below while falling. */
  fallProgress = 0;
  /** Visual horizontal offset (in cells) left over from being pushed. */
  slide = 0;
  private timer = 0;
  private fallen = 0;

  constructor(public cx: number, public cy: number) {}

  /** Moves the bag one cell sideways. The logical cell changes at once; the sprite slides. */
  push(dx: number): void {
    this.cx += dx;
    this.slide = -dx;
  }

  update(world: World, dt: number): void {
    if (this.slide !== 0) {
      const step = PLAYER_SPEED * dt;
      this.slide = Math.abs(this.slide) <= step ? 0 : this.slide - Math.sign(this.slide) * step;
      return;
    }

    switch (this.state) {
      case 'idle':
        if (this.canFall(world)) {
          this.state = 'wobble';
          this.timer = BAG_WOBBLE_TIME;
        }
        break;

      case 'wobble':
        this.timer -= dt;
        if (this.timer <= 0) {
          if (this.canFall(world)) {
            this.state = 'fall';
            this.fallProgress = 0;
            this.fallen = 0;
          } else {
            this.state = 'idle';
          }
        }
        break;

      case 'fall':
        this.fallProgress += BAG_FALL_SPEED * dt;
        while (this.fallProgress >= 1) {
          this.fallProgress -= 1;
          this.cy += 1;
          this.fallen += 1;
          if (!this.canFall(world)) {
            this.fallProgress = 0;
            this.state = this.fallen >= BAG_BREAK_HEIGHT ? 'broken' : 'idle';
            break;
          }
        }
        break;

      case 'broken':
        break;
    }
  }

  /** A bag falls when the cell beneath it is open tunnel and not occupied by another bag. */
  private canFall(world: World): boolean {
    return this.cy + 1 < ROWS && world.dug[this.cy + 1][this.cx] && !world.bagAt(this.cx, this.cy + 1);
  }
}
