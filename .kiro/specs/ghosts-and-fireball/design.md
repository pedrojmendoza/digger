# Design: Ghosts and fireball

## Components
- `src/entities/enemy.ts` (`Enemy extends GridMover`)
  - `update(dt, world, target)` advances at `speed`, picking a direction at each cell.
  - `chooseDir`: BFS first, then random wander as a fallback.
  - `firstStepTowards`: BFS over open cells, storing the first direction taken to reach each
    cell, and returning the stored direction when the target is reached.
  - `open(world, x, y)`: in bounds, dug, no bag.
  - `alive` flag.
- `src/entities/fireball.ts`: moves in cell units, and sets `alive = false` when the rounded
  cell is out of bounds, undug or holds a bag.
- `src/game.ts`
  - `spawnEnemies(dt)` applies the spawn rules using the level definition.
  - Fireball and ghost overlap uses a box distance of 0.6 cells.
  - `killEnemy` marks the ghost dead, adds 250 points and removes it from the list.
  - Firing is gated by `fireCooldown` and clears on death or level load.
- `src/levels.ts`: `enemyTotal`, `enemyMax`, `firstSpawnDelay`, `spawnInterval`, `enemySpeed`.
- `src/renderer.ts`: ghost sprite with floating bob, fireball glow, HUD charge bar.

## Decisions
- The BFS target is the player's current `cell`, which flips at the halfway point of a move.
- Ghosts do not collide with each other.
- All ghosts use the same logic. The original game's digging enemies (Hobbins) are not built.

## Risks
- BFS runs for every ghost every time it reaches a cell. On a 15 by 10 grid that costs
  nothing noticeable.
- A ghost standing on a freshly landed bag position is not handled specially.
