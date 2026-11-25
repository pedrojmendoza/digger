# Requirements: Ghosts and fireball

Status: implemented. Written after the fact from the code in `src/`.

## Introduction
Ghosts hunt the player through the tunnels. The player can shoot a fireball to kill them,
and loses a life on contact.

## Requirements

### 1. Spawning
**User story:** As a player, I want ghosts to arrive over time, so that the pressure builds
gradually.

Acceptance criteria
1. WHEN a level starts THEN the first ghost SHALL appear after the level's first-spawn delay
   (3 seconds in both current levels).
2. WHEN the spawn timer has run out AND fewer than the level's maximum ghosts are alive
   AND fewer than the level's total have spawned AND no ghost is within 1 cell of the spawn
   cell THEN the system SHALL spawn a ghost at the `S` cell.
3. After a spawn, the system SHALL wait the level's spawn interval before the next one
   (7 seconds on level 1, 6 on level 2).

### 2. Chasing
**User story:** As a player, I want ghosts to track me, so that tunnels are risky.

Acceptance criteria
1. Ghosts SHALL move only through open tunnel cells that hold no bag.
2. WHEN a path to the player exists THEN a ghost SHALL take the first step of the shortest
   path (breadth-first search) at each cell it reaches.
3. IF no path exists THEN the ghost SHALL wander, avoiding turning back unless it is at a
   dead end.
4. Ghosts SHALL move at the level's ghost speed (2.0 cells per second on level 1, 2.2 on
   level 2).

### 3. Contact
Acceptance criteria
1. WHEN a ghost is within 0.6 cells of the player THEN the player SHALL lose a life.

### 4. Fireball
**User story:** As a player, I want a way to fight back, so that I am not only running.

Acceptance criteria
1. WHEN the player presses Space or F AND the cooldown is zero THEN the system SHALL fire a
   fireball from the digger in the direction it faces.
2. After firing, the cooldown SHALL be 6 seconds, and the HUD SHALL show the recharge.
3. The fireball SHALL travel at 9 cells per second through open tunnel.
4. WHEN the fireball reaches dirt, a bag or the edge of the grid THEN it SHALL disappear.
5. WHEN the fireball is within 0.6 cells of a ghost THEN the ghost SHALL die, the fireball
   SHALL disappear and the player SHALL score 250.
