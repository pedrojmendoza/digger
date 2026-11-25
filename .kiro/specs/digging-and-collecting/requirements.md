# Requirements: Digging and collecting

Status: implemented. Written after the fact from the code in `src/`.

## Introduction
The player drives a digger through a grid of dirt, cutting tunnels and collecting pumpkins
for points.

## Requirements

### 1. Grid movement
**User story:** As a player, I want to move cleanly from cell to cell, so that steering
through tunnels is predictable.

Acceptance criteria
1. The playfield SHALL be a grid of 15 columns by 10 rows.
2. WHEN the player holds a direction key and the next cell is inside the grid THEN the
   digger SHALL move into that cell at 3.5 cells per second.
3. WHEN the player holds the opposite direction while moving THEN the digger SHALL turn
   around immediately, without finishing the move.
4. WHEN several direction keys are held THEN the most recently pressed one SHALL win.
5. The digger SHALL accept arrow keys and WASD.
6. WHEN the player presses a direction without being able to move THEN the digger SHALL
   still turn to face that direction.

### 2. Digging
**User story:** As a player, I want to cut tunnels through dirt, so that I can reach
pumpkins and shape where ghosts can go.

Acceptance criteria
1. WHEN the digger is more than halfway into a cell THEN the system SHALL mark that cell
   as tunnel.
2. Tunnel cells SHALL stay open for the rest of the level.
3. WHILE the digger moves through dirt THEN the system SHALL draw the trail behind it as
   open tunnel.

### 3. Pumpkins and scoring
**User story:** As a player, I want points for collecting pumpkins, so that I have a goal.

Acceptance criteria
1. WHEN the digger enters a cell with a pumpkin THEN the system SHALL remove the pumpkin
   and add 25 points.
2. WHEN the player collects 8 pumpkins in a row, with no non-pumpkin cell between them,
   THEN the system SHALL add a 250 point bonus and reset the streak.
3. WHEN the digger enters a cell without a pumpkin THEN the system SHALL reset the streak.
4. WHEN the digger enters a cell with spilled candy THEN the system SHALL remove the candy
   and add 500 points.
