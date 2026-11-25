# Design: Candy bags

## Overview
Each bag is a small state machine: `idle`, `wobble`, `fall`, `broken`.

## Components
- `src/entities/bag.ts`
  - Fields: `cx`, `cy`, `state`, `fallProgress`, `slide`, plus private timer and fall count.
  - `update(world, dt)`: first lets any push `slide` decay at player speed. Then
    `idle` to `wobble` when `canFall`. `wobble` counts down `BAG_WOBBLE_TIME`, then
    becomes `fall`. `fall` advances `fallProgress` and moves `cy` down one cell at a time.
    On landing it becomes `broken` if it fell at least `BAG_BREAK_HEIGHT` cells, otherwise
    `idle`.
  - `canFall`: row below exists, `world.dug[cy+1][cx]` is true, and no bag is there.
  - `push(dx)`: moves the logical cell at once and sets `slide = -dx` so the sprite glides.
- `src/world.ts`: `bagAt(x, y)` ignores broken bags. `collapseBrokenBags()` turns broken
  bags into `golds[]` entries.
- `src/entities/player.ts`: `tryEnter` applies the push rules.
- `src/entities/enemy.ts`: its `open()` check refuses cells holding a bag.
- `src/game.ts`: each frame, for every falling bag, checks the distance to each ghost and to
  the player.
- `src/config.ts`: `BAG_WOBBLE_TIME`, `BAG_FALL_SPEED`, `BAG_BREAK_HEIGHT`.

## Decisions
- A bag's hollow starts as open tunnel. A bag placed above open tunnel will start to fall.
  Level maps must avoid that.
- Crush checks use a box distance (0.7 cells) in cell units, not pixels.
- Bags that fall only one cell still crush whatever is under them.

## Risks
- A bag pushed over an open cell with tunnel below will fall as soon as the slide ends.
  This is intended.
