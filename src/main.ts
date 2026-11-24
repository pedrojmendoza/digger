import { HEIGHT, WIDTH } from './config';
import { Game } from './game';
import { Input } from './input';
import { Renderer } from './renderer';

const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const game = new Game(new Input(window));
const renderer = new Renderer(canvas.getContext('2d')!);

let last = performance.now();
function frame(now: number): void {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  game.update(dt);
  renderer.draw(game);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
