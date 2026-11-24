# Code structure and conventions

- `src/config.ts`: tile size, speeds (cells per second), timings (seconds), scores.
- `src/levels.ts`: level definitions. Maps are 15 columns x 10 rows of text.
  Legend: `#` dirt, `.` tunnel, `E` emerald, `B` gold bag, `P` player start, `S` enemy spawn.
  Each level also sets enemy count, max alive, spawn timing and speed.
- `src/world.ts`: grid state (dug cells, emeralds, bags, gold piles). Parses level maps.
- `src/entities/`: `GridMover` (cell-to-cell movement base), `Player`, `Enemy`, `Bag`, `Fireball`.
- `src/game.ts`: state machine (title, playing, dying, levelClear, gameOver), scoring, collisions.
- `src/renderer.ts`: all drawing. Game logic must not draw, and the renderer must not change state.
- `src/input.ts`: keyboard input. Direction is the most recently pressed held key.

Conventions:
- Positions are in cell units (floats). Multiply by `TILE` only when drawing.
- Entities move one cell at a time through `GridMover.advance`.
- Use `import type` for type-only imports. `noUnusedLocals` and `noUnusedParameters` are on.
- Add new levels by appending to `LEVELS`. The loader throws if a map has the wrong size
  or an unknown character.
