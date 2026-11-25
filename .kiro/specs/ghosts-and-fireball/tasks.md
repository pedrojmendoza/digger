# Tasks: Ghosts and fireball

- [x] 1. `Enemy` class with BFS chase and wander fallback (`src/entities/enemy.ts`)
- [x] 2. Per-level enemy settings in `src/levels.ts`
- [x] 3. Spawn logic with delay, interval, max alive and total (`Game.spawnEnemies`)
- [x] 4. Contact kills the player (`Game.updatePlaying`)
- [x] 5. `Fireball` entity and firing with cooldown
- [x] 6. Fireball kills ghosts, scores 250 (`Game.killEnemy`)
- [x] 7. Draw ghosts, fireball and the HUD charge bar (`src/renderer.ts`)

## Verification status
- Seen running: a ghost appearing at the top-right spawn point and floating in the tunnel,
  and the HUD charge bar.
- Written but not seen: the chase path, wandering, contact death, firing, killing a ghost.
