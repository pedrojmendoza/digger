import {
  DEATH_TIME, EMERALD_STREAK, FIREBALL_COOLDOWN, LEVEL_CLEAR_TIME, SCORE, START_LIVES,
} from './config';
import { Enemy } from './entities/enemy';
import { Fireball } from './entities/fireball';
import { Player } from './entities/player';
import type { Input } from './input';
import { LEVELS } from './levels';
import type { LevelDef } from './levels';
import type { Vec } from './types';
import { World } from './world';

export type GameState = 'title' | 'playing' | 'dying' | 'levelClear' | 'gameOver';

export class Game {
  state: GameState = 'title';
  paused = false;
  score = 0;
  lives = START_LIVES;
  levelIndex = 0;
  time = 0;
  fireCooldown = 0;

  world!: World;
  player!: Player;
  enemies: Enemy[] = [];
  fireballs: Fireball[] = [];

  private stateTimer = 0;
  private spawnTimer = 0;
  private spawned = 0;
  private streak = 0;
  private lastCell = '';

  constructor(private input: Input) {
    this.loadLevel(0);
  }

  get def(): LevelDef {
    return this.world.def;
  }

  update(dt: number): void {
    this.time += dt;
    const input = this.input;

    switch (this.state) {
      case 'title':
        if (input.consume('start')) this.startNewGame();
        break;
      case 'playing':
        if (input.consume('pause')) this.paused = !this.paused;
        if (!this.paused) this.updatePlaying(dt);
        break;
      case 'dying':
        this.world.bags.forEach((b) => b.update(this.world, dt));
        this.world.collapseBrokenBags();
        if ((this.stateTimer -= dt) <= 0) this.respawnOrEnd();
        break;
      case 'levelClear':
        if ((this.stateTimer -= dt) <= 0) {
          this.loadLevel(this.levelIndex + 1);
          this.state = 'playing';
        }
        break;
      case 'gameOver':
        if (input.consume('start')) {
          this.loadLevel(0);
          this.state = 'title';
        }
        break;
    }
    input.endFrame();
  }

  private startNewGame(): void {
    this.score = 0;
    this.lives = START_LIVES;
    this.loadLevel(0);
    this.state = 'playing';
  }

  private loadLevel(index: number): void {
    this.levelIndex = index;
    const def = LEVELS[index % LEVELS.length];
    // Each pass through the level list makes enemies 10% faster.
    const cycle = Math.floor(index / LEVELS.length);
    this.world = new World({ ...def, enemySpeed: def.enemySpeed * (1 + 0.1 * cycle) });
    this.spawned = 0;
    this.resetActors();
  }

  private resetActors(): void {
    const { playerStart } = this.world;
    this.player = new Player(playerStart.x, playerStart.y);
    this.enemies = [];
    this.fireballs = [];
    this.fireCooldown = 0;
    this.spawnTimer = this.def.firstSpawnDelay;
    this.streak = 0;
    this.lastCell = `${playerStart.x},${playerStart.y}`;
  }

  private updatePlaying(dt: number): void {
    const { world, player, input } = this;

    // Player
    player.update(dt, input.direction, world);
    const cell = player.cell;
    world.dug[cell.y][cell.x] = true;
    this.collect(cell);

    this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    if (input.consume('fire') && this.fireCooldown === 0) {
      this.fireballs.push(new Fireball(player.x, player.y, player.facing));
      this.fireCooldown = FIREBALL_COOLDOWN;
    }

    // Bags
    world.bags.forEach((b) => b.update(world, dt));
    world.collapseBrokenBags();

    // Enemies
    this.spawnEnemies(dt);
    this.enemies.forEach((e) => e.update(dt, world, cell));

    // Fireballs
    for (const f of this.fireballs) {
      f.update(dt, world);
      for (const e of this.enemies) {
        if (f.alive && near(f.x, f.y, e.x, e.y, 0.6)) {
          f.alive = false;
          this.killEnemy(e);
        }
      }
    }
    this.fireballs = this.fireballs.filter((f) => f.alive);

    // Falling bags crush whatever they land on
    for (const bag of world.bags) {
      if (bag.state !== 'fall') continue;
      const by = bag.cy + bag.fallProgress;
      for (const e of this.enemies) {
        if (near(bag.cx, by, e.x, e.y, 0.7)) this.killEnemy(e);
      }
      if (near(bag.cx, by, player.x, player.y, 0.7)) return this.killPlayer();
    }
    this.enemies = this.enemies.filter((e) => e.alive);

    // Enemy contact
    if (this.enemies.some((e) => near(e.x, e.y, player.x, player.y, 0.6))) return this.killPlayer();

    // Level complete
    const allEnemiesDone = this.spawned >= this.def.enemyTotal && this.enemies.length === 0;
    if (world.emeraldsLeft === 0 || allEnemiesDone) {
      this.state = 'levelClear';
      this.stateTimer = LEVEL_CLEAR_TIME;
    }
  }

  private collect(cell: Vec): void {
    const key = `${cell.x},${cell.y}`;
    if (key === this.lastCell) return;
    this.lastCell = key;
    const { world } = this;

    if (world.emeralds[cell.y][cell.x]) {
      world.emeralds[cell.y][cell.x] = false;
      world.emeraldsLeft--;
      this.score += SCORE.emerald;
      if (++this.streak >= EMERALD_STREAK) {
        this.score += SCORE.emeraldStreak;
        this.streak = 0;
      }
    } else {
      this.streak = 0;
    }

    const gold = world.golds.findIndex((g) => g.x === cell.x && g.y === cell.y);
    if (gold >= 0) {
      world.golds.splice(gold, 1);
      this.score += SCORE.gold;
    }
  }

  private spawnEnemies(dt: number): void {
    this.spawnTimer -= dt;
    const { enemySpawn } = this.world;
    const clear = this.enemies.every((e) => !near(e.x, e.y, enemySpawn.x, enemySpawn.y, 1));
    if (this.spawnTimer <= 0 && clear && this.spawned < this.def.enemyTotal && this.enemies.length < this.def.enemyMax) {
      this.enemies.push(new Enemy(enemySpawn.x, enemySpawn.y, this.def.enemySpeed));
      this.spawned++;
      this.spawnTimer = this.def.spawnInterval;
    }
  }

  private killEnemy(enemy: Enemy): void {
    if (!enemy.alive) return;
    enemy.alive = false;
    this.score += SCORE.enemyKill;
    this.enemies = this.enemies.filter((e) => e !== enemy);
  }

  private killPlayer(): void {
    this.state = 'dying';
    this.stateTimer = DEATH_TIME;
    this.fireballs = [];
  }

  private respawnOrEnd(): void {
    this.lives--;
    if (this.lives <= 0) {
      this.state = 'gameOver';
      return;
    }
    // Enemies that were alive go back into the queue.
    this.spawned = Math.max(0, this.spawned - this.enemies.length);
    this.resetActors();
    this.state = 'playing';
  }
}

function near(ax: number, ay: number, bx: number, by: number, radius: number): boolean {
  return Math.abs(ax - bx) < radius && Math.abs(ay - by) < radius;
}
