import { COLS, FIREBALL_COOLDOWN, HEIGHT, HUD_H, ROWS, TILE, WIDTH } from './config';
import { Bag } from './entities/bag';
import type { Game } from './game';
import type { Dir } from './types';

const ANGLE: Record<Dir, number> = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };

export class Renderer {
  private dirt: HTMLCanvasElement;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.dirt = this.makeDirt();
  }

  draw(game: Game): void {
    const { ctx } = this;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.drawTerrain(game);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (game.world.emeralds[y][x]) this.drawEmerald(x, y);
      }
    }
    game.world.golds.forEach((g) => this.drawGold(g.x, g.y));
    game.world.bags.forEach((b) => this.drawBag(b, game.time));
    game.enemies.forEach((e) => this.drawEnemy(e.x, e.y, game.time));

    if (game.state === 'dying') this.drawTomb(game.player.x, game.player.y);
    else if (game.state !== 'gameOver') this.drawDigger(game.player.x, game.player.y, game.player.facing);

    game.fireballs.forEach((f) => this.drawFireball(f.x, f.y, game.time));
    this.drawHud(game);
    this.drawOverlay(game);
  }

  private px(cell: number): number {
    return cell * TILE;
  }

  private py(cell: number): number {
    return cell * TILE + HUD_H;
  }

  // ---- Terrain -------------------------------------------------------------

  private makeDirt(): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = WIDTH;
    c.height = ROWS * TILE;
    const g = c.getContext('2d')!;
    g.fillStyle = '#42283a';
    g.fillRect(0, 0, c.width, c.height);
    let seed = 12345;
    const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const shades = ['#2f1b2b', '#573650', '#38222f', '#4b2e44'];
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = shades[Math.floor(rand() * shades.length)];
      g.fillRect(Math.floor(rand() * c.width), Math.floor(rand() * c.height), 3, 3);
    }
    return c;
  }

  private drawTerrain(game: Game): void {
    const { ctx } = this;
    ctx.drawImage(this.dirt, 0, HUD_H);
    ctx.fillStyle = '#000';
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (game.world.dug[y][x]) ctx.fillRect(this.px(x), this.py(y), TILE, TILE);
      }
    }
    // Trail under the digger while it cuts into dirt.
    if (game.state !== 'title') {
      ctx.fillRect(this.px(game.player.x), this.py(game.player.y), TILE, TILE);
    }
  }

  // ---- Sprites -------------------------------------------------------------

  private withTransform(x: number, y: number, fn: () => void, rotation = 0): void {
    const { ctx } = this;
    ctx.save();
    ctx.translate(this.px(x) + TILE / 2, this.py(y) + TILE / 2);
    if (rotation) ctx.rotate(rotation);
    fn();
    ctx.restore();
  }

  private drawDigger(x: number, y: number, facing: Dir): void {
    const { ctx } = this;
    this.withTransform(x, y, () => {
      ctx.fillStyle = '#444';
      ctx.fillRect(-18, -17, 30, 7);
      ctx.fillRect(-18, 10, 30, 7);
      ctx.fillStyle = '#e8d02a';
      ctx.fillRect(-16, -10, 28, 20);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(-8, -7, 14, 14);
      ctx.fillStyle = '#bbb';
      ctx.beginPath();
      ctx.moveTo(12, -8);
      ctx.lineTo(22, 0);
      ctx.lineTo(12, 8);
      ctx.fill();
    }, ANGLE[facing]);
  }

  private drawTomb(x: number, y: number): void {
    const { ctx } = this;
    this.withTransform(x, y, () => {
      ctx.fillStyle = '#9a9a9a';
      ctx.fillRect(-12, -6, 24, 20);
      ctx.beginPath();
      ctx.arc(0, -6, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.fillRect(-2, -12, 4, 14);
      ctx.fillRect(-7, -7, 14, 4);
    });
  }

  private drawEnemy(x: number, y: number, t: number): void {
    const { ctx } = this;
    const bob = Math.sin(t * 4 + x * 3) * 3; // ghosts float
    this.withTransform(x, y + bob / TILE, () => {
      ctx.globalAlpha = 0.93;
      ctx.fillStyle = '#f2f2ff';
      ctx.beginPath();
      ctx.moveTo(-15, -2);
      ctx.arc(0, -2, 15, Math.PI, 0);
      ctx.lineTo(15, 17);
      ctx.quadraticCurveTo(10, 10, 5, 17);
      ctx.quadraticCurveTo(0, 10, -5, 17);
      ctx.quadraticCurveTo(-10, 10, -15, 17);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.ellipse(-6, -4, 3, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(6, -4, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 7, 3.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private drawBag(bag: Bag, t: number): void {
    const { ctx } = this;
    const wobble = bag.state === 'wobble' ? Math.sin(t * 50) * 0.2 : 0;
    this.withTransform(bag.cx + bag.slide, bag.cy + bag.fallProgress, () => {
      ctx.rotate(wobble);
      // purple sack
      ctx.fillStyle = '#7d3c98';
      ctx.beginPath();
      ctx.ellipse(0, 4, 16, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5b2c70';
      ctx.fillRect(-6, -14, 12, 6);
      // orange ribbon
      ctx.fillStyle = '#ff7518';
      ctx.fillRect(-7, -9, 14, 3);
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(-9, -15);
      ctx.lineTo(-9, -5);
      ctx.moveTo(0, -8);
      ctx.lineTo(9, -15);
      ctx.lineTo(9, -5);
      ctx.fill();
      // wrapped candy on the front
      this.drawWrappedCandy(0, 7, 1, '#ff6fa8');
    });
  }

  private drawEmerald(x: number, y: number): void {
    const { ctx } = this;
    this.withTransform(x, y, () => {
      // mini pumpkin
      ctx.fillStyle = '#ff7518';
      ctx.beginPath();
      ctx.ellipse(0, 3, 13, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b84a05';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 3, 6, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(-2, -10, 4, 6);
    });
  }

  private drawWrappedCandy(x: number, y: number, scale: number, color: string): void {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-11, -4);
    ctx.lineTo(-11, 4);
    ctx.moveTo(5, 0);
    ctx.lineTo(11, -4);
    ctx.lineTo(11, 4);
    ctx.fill();
    ctx.restore();
  }

  private drawGold(x: number, y: number): void {
    this.withTransform(x, y, () => {
      // spilled candy
      const candies: [number, number, string][] = [
        [-9, 9, '#ff6fa8'],
        [9, 8, '#4fc3f7'],
        [0, -1, '#a5d63f'],
      ];
      for (const [dx, dy, color] of candies) this.drawWrappedCandy(dx, dy, 0.8, color);
    });
  }

  private drawFireball(x: number, y: number, t: number): void {
    const { ctx } = this;
    this.withTransform(x, y, () => {
      ctx.fillStyle = '#ff6a00';
      ctx.beginPath();
      ctx.arc(0, 0, 8 + Math.sin(t * 40), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe066';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ---- HUD and overlays ------------------------------------------------------

  private drawHud(game: Game): void {
    const { ctx } = this;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HUD_H);
    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.fillText(`SCORE ${String(game.score).padStart(6, '0')}`, 16, HUD_H / 2);
    ctx.fillText(`LEVEL ${game.levelIndex + 1}`, 270, HUD_H / 2);

    ctx.fillStyle = '#ff7518';
    ctx.fillText('LIVES', 420, HUD_H / 2);
    ctx.fillStyle = '#e8d02a';
    for (let i = 0; i < game.lives; i++) ctx.fillRect(505 + i * 22, HUD_H / 2 - 7, 16, 14);

    // Fireball charge
    const ready = 1 - game.fireCooldown / FIREBALL_COOLDOWN;
    ctx.fillStyle = '#333';
    ctx.fillRect(WIDTH - 70, HUD_H / 2 - 7, 56, 14);
    ctx.fillStyle = ready >= 1 ? '#ff6a00' : '#7a3a00';
    ctx.fillRect(WIDTH - 70, HUD_H / 2 - 7, 56 * ready, 14);
  }

  private drawOverlay(game: Game): void {
    let title = '';
    let sub = '';
    switch (game.state) {
      case 'title':
        title = 'CANDY DIGGER';
        sub = 'Press ENTER to start';
        break;
      case 'levelClear':
        title = 'LEVEL CLEAR';
        break;
      case 'gameOver':
        title = 'GAME OVER';
        sub = `Score ${game.score}. Press ENTER`;
        break;
      case 'playing':
        if (game.paused) title = 'PAUSED';
        break;
      default:
        return;
    }
    if (!title) return;

    const { ctx } = this;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, HUD_H, WIDTH, HEIGHT - HUD_H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff7518';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(title, WIDTH / 2, HEIGHT / 2 - 20);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(sub, WIDTH / 2, HEIGHT / 2 + 30);
    if (game.state === 'title') {
      ctx.font = '16px monospace';
      ctx.fillText('Arrows/WASD: move   Space/F: fireball   P: pause', WIDTH / 2, HEIGHT / 2 + 70);
    }
  }
}
