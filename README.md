# Candy Digger

A Halloween-themed, arcade-style digging game: dig through dark soil, collect pumpkins, drop candy bags on ghosts. TypeScript, HTML5 Canvas, Vite, no game framework.

## Run

    npm install
    npm run dev        # serves on http://127.0.0.1:5173 (see vite.config.ts)
    npm run build      # typecheck + production bundle in dist/

## Controls

- Arrows or WASD: move and dig
- Space or F: fireball (6 second recharge)
- P: pause
- Enter: start / restart

## Rules in this prototype

- Pumpkins (the original emeralds) are 25 points. Eight in a row without a gap give a 250 bonus.
- Push candy bags sideways into open tunnel. Dig out from under one and it falls.
- A bag that falls 2 or more cells spills its candy (500 points). Bags crush ghosts (250) and you.
- Ghosts spawn from `S`, stay in tunnels, and chase you by shortest path.
- Collect all pumpkins or get rid of all ghosts to finish the level. Levels cycle and enemies speed up 10% per cycle.

## Layout

- `src/config.ts`: tile size, speeds, timings, scores
- `src/levels.ts`: level maps (legend in the file) and per-level enemy settings
- `src/world.ts`: grid state (dirt, emeralds, bags, gold)
- `src/entities/`: `GridMover` base, `Player`, `Enemy`, `Bag`, `Fireball`
- `src/game.ts`: state machine, scoring, collisions
- `src/renderer.ts`: all drawing (shapes only, no assets)
- `src/input.ts`: keyboard handling

## Not yet built

Ghosts that dig through dirt (the original Hobbins), bonus item, sound, high scores, more levels, touch controls.

## Disclaimer

Candy Digger is an independent, fan-made homage to the 1983 arcade game Digger by Windmill
Software. It is not affiliated with or endorsed by Windmill Software or any rights holder of
the original game. It contains no code, graphics, sound or level data from the original or
from any remake. All code and artwork in this repository are original and released under the
MIT license (see `LICENSE`).

The repository is still named `digger` on GitHub.
