import { COLS, ROWS } from './config';
import { Bag } from './entities/bag';
import type { LevelDef } from './levels';
import type { Vec } from './types';

function grid(): boolean[][] {
  return Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
}

export class World {
  readonly dug = grid();
  readonly emeralds = grid();
  readonly bags: Bag[] = [];
  readonly golds: Vec[] = [];
  playerStart: Vec = { x: 0, y: 0 };
  enemySpawn: Vec = { x: 0, y: 0 };
  emeraldsLeft = 0;

  constructor(readonly def: LevelDef) {
    if (def.map.length !== ROWS) throw new Error(`Level must have ${ROWS} rows`);
    def.map.forEach((row, y) => {
      if (row.length !== COLS) throw new Error(`Level row ${y} must have ${COLS} columns`);
      for (let x = 0; x < COLS; x++) {
        switch (row[x]) {
          case '#': break;
          case '.': this.dug[y][x] = true; break;
          case 'E': this.emeralds[y][x] = true; this.emeraldsLeft++; break;
          case 'B': this.dug[y][x] = true; this.bags.push(new Bag(x, y)); break;
          case 'P': this.dug[y][x] = true; this.playerStart = { x, y }; break;
          case 'S': this.dug[y][x] = true; this.enemySpawn = { x, y }; break;
          default: throw new Error(`Unknown map character '${row[x]}' at ${x},${y}`);
        }
      }
    });
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < COLS && y < ROWS;
  }

  bagAt(x: number, y: number): Bag | undefined {
    return this.bags.find((b) => b.state !== 'broken' && b.cx === x && b.cy === y);
  }

  /** Turns bags that have finished breaking into gold piles. */
  collapseBrokenBags(): void {
    for (let i = this.bags.length - 1; i >= 0; i--) {
      const bag = this.bags[i];
      if (bag.state === 'broken') {
        this.golds.push({ x: bag.cx, y: bag.cy });
        this.bags.splice(i, 1);
      }
    }
  }
}
