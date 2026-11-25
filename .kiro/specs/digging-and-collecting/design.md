# Design: Digging and collecting

## Overview
Entities live on a cell grid and move one cell at a time. Positions are floats in cell
units, and the renderer multiplies by `TILE` only when drawing.

## Components
- `src/entities/gridMover.ts`: base class with `cx`, `cy`, `dir`, `progress` (0..1) and
  `facing`. `advance(distance, pick)` consumes distance, calls `pick()` at each cell to get
  the next direction, and carries leftover distance into the next cell. `reverse()` swaps
  origin and target. The `cell` getter returns the target once `progress >= 0.5`.
- `src/entities/player.ts`: `update(dt, want, world)` handles reversing and facing, then
  advances. `tryEnter` checks bounds and bags.
- `src/input.ts`: keeps a stack of held directions (last pressed wins). `consume(action)`
  reports a key press once per frame, and `endFrame()` clears presses.
- `src/world.ts`: `dug[][]` and `emeralds[][]` grids plus `golds[]`. Built from the text
  maps in `src/levels.ts`.
- `src/game.ts`: after the player moves, sets `world.dug[cell]`, then `collect(cell)` handles
  pumpkins, the streak and candy.
- `src/config.ts`: `PLAYER_SPEED`, `SCORE`, `EMERALD_STREAK`.

## Decisions
- Cell changes are detected by comparing `"x,y"` keys, so collection happens once per cell.
- The code keeps the original names (`emerald`) even though pumpkins are drawn.
- No buffering of a direction tapped between cells. A very short tap can be missed.

## Risks
- None known.
