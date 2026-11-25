# Design: Game flow and presentation

## Components
- `src/game.ts`: `Game` holds a `state` of `title`, `playing`, `dying`, `levelClear` or
  `gameOver`, plus `paused`, score, lives and the level index. `update(dt)` switches on the
  state. `loadLevel`, `resetActors`, `respawnOrEnd` and `startNewGame` manage transitions.
  `input.endFrame()` runs at the end of each update.
- `src/levels.ts`: `LEVELS` array. `loadLevel(i)` uses `LEVELS[i % length]` and multiplies
  enemy speed by `1 + 0.1 * cycle`.
- `src/world.ts`: parses maps. Legend: `#` dirt, `.` tunnel, `E` pumpkin, `B` candy bag,
  `P` player start, `S` ghost spawn.
- `src/renderer.ts`: draws in order: dirt and tunnels, pumpkins, candy piles, bags, ghosts,
  digger or tombstone, fireballs, HUD, overlay. The dirt texture is pre-rendered once with a
  seeded random generator. The renderer reads game state and never changes it.
- `src/main.ts`: canvas setup and the `requestAnimationFrame` loop, with delta time capped
  at 0.05 seconds.
- `index.html`, `vite.config.ts`: page shell, relative `base` for Pages, fixed dev port.
- `.github/workflows/deploy.yml`: build with Node 22 and deploy with the Pages actions.
- `LICENSE`, `README.md`: MIT license and the disclaimer.

## Decisions
- Fixed canvas size of 720 by 528, scaled with CSS.
- Code names from the original game are kept. Only visuals and text are themed.
- No automated tests yet. Verification is `npm run build` plus play-testing.

## Risks
- There is no touch input, so the game needs a keyboard.
- Pages deployment needs a one-time manual step to set the source to GitHub Actions.
