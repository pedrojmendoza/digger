# Requirements: Candy bags

Status: implemented. Written after the fact from the code in `src/`.

## Introduction
Candy bags sit in the dirt. They can be pushed sideways, they fall when the ground under
them is dug away, and they spill candy if they fall far enough. They can crush ghosts and
the player.

## Requirements

### 1. Pushing
**User story:** As a player, I want to push bags along a tunnel, so that I can place them
above ghosts.

Acceptance criteria
1. WHEN the digger moves sideways into a resting bag AND the cell beyond is inside the grid,
   open tunnel and free of other bags THEN the system SHALL push the bag one cell.
2. IF the cell beyond is dirt, outside the grid or holds another bag THEN the digger SHALL
   be blocked.
3. The digger SHALL NOT push a bag up or down.
4. The digger SHALL NOT enter a cell with a bag that is wobbling or falling.

### 2. Falling
**User story:** As a player, I want bags to drop when I dig under them, so that I can use
them as traps.

Acceptance criteria
1. WHEN the cell below a resting bag is open tunnel and holds no bag THEN the bag SHALL
   wobble for 0.7 seconds and then fall at 7 cells per second.
2. WHEN a bag finishes wobbling and the cell below is no longer open THEN the bag SHALL
   return to rest.
3. WHILE falling, the bag SHALL keep falling until the cell below is dirt, the bottom row
   or another bag.

### 3. Landing
Acceptance criteria
1. WHEN a bag lands after falling 2 or more cells THEN the system SHALL replace it with a
   pile of spilled candy.
2. WHEN a bag lands after falling fewer than 2 cells THEN it SHALL stay intact.
3. Spilled candy SHALL NOT block movement.

### 4. Crushing
Acceptance criteria
1. WHILE a bag is falling AND a ghost is within 0.7 cells of it THEN the ghost SHALL die
   and the player SHALL score 250.
2. WHILE a bag is falling AND the player is within 0.7 cells of it THEN the player SHALL
   lose a life.
3. Ghosts SHALL treat bags as walls.
