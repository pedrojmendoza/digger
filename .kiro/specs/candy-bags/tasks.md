# Tasks: Candy bags

- [x] 1. `Bag` state machine with wobble, fall and break (`src/entities/bag.ts`)
- [x] 2. Sideways push with sliding sprite (`Bag.push`, `Player.tryEnter`)
- [x] 3. `World.bagAt` and `collapseBrokenBags`
- [x] 4. Ghosts treat bags as walls (`Enemy.open`)
- [x] 5. Crush ghosts and player while falling (`Game.updatePlaying`)
- [x] 6. Draw candy bags, wobble and spilled candy (`Renderer.drawBag`, `drawGold`)
- [x] 7. Tuning constants in `src/config.ts`

## Verification status
- Seen running: bags drawn in place, and the digger stopping beside a bag it could not push.
- Written but not seen: pushing a bag, wobbling, falling, breaking into candy, crushing.
