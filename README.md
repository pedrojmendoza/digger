# Digger

A classic-style Digger prototype. TypeScript, HTML5 Canvas, Vite, no game framework.

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

- Emeralds are 25 points. Eight in a row without a gap give a 250 bonus.
- Push gold bags sideways into open tunnel. Dig out from under one and it falls.
- A bag that falls 2 or more cells breaks into gold (500 points). Bags crush enemies (250) and you.
- Nobbins spawn from `S`, stay in tunnels, and chase you by shortest path.
- Clear all emeralds or all enemies to finish the level. Levels cycle and enemies speed up 10% per cycle.

## Layout

- `src/config.ts`: tile size, speeds, timings, scores
- `src/levels.ts`: level maps (legend in the file) and per-level enemy settings
- `src/world.ts`: grid state (dirt, emeralds, bags, gold)
- `src/entities/`: `GridMover` base, `Player`, `Enemy`, `Bag`, `Fireball`
- `src/game.ts`: state machine, scoring, collisions
- `src/renderer.ts`: all drawing (shapes only, no assets)
- `src/input.ts`: keyboard handling

## Not yet built

Hobbins (enemies that dig), bonus cherry, sound, high scores, more levels, touch controls.
