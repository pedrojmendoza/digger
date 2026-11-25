# Tasks: Digging and collecting

- [x] 1. Grid, tile and speed constants in `src/config.ts`
- [x] 2. `GridMover` base class with carry-over movement and mid-move reverse
- [x] 3. Keyboard input with held-direction stack and one-shot actions (`src/input.ts`)
- [x] 4. `Player` with facing and wall aiming
- [x] 5. `World` grids and level map parser (`src/world.ts`)
- [x] 6. Mark cells dug past the halfway point (`Game.updatePlaying`)
- [x] 7. Pumpkin pickup, 8-in-a-row bonus and candy pickup (`Game.collect`)
- [x] 8. Draw dirt texture, tunnels, trail and pumpkins (`src/renderer.ts`)

## Verification status
- Seen running in a headless browser: moving, digging, tunnel trail, picking up a pumpkin
  (score 25), rendering.
- Written but not seen: the 8-pumpkin bonus, candy pickup, turning around mid-move.
