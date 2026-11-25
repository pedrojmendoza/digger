# Requirements: Game flow and presentation

Status: implemented. Written after the fact from the code in `src/`.

## Introduction
The game moves through a title screen, play, death, level clear and game over. It shows a
HUD and uses a Halloween theme. It runs in the browser and deploys to GitHub Pages.

## Requirements

### 1. Game states
Acceptance criteria
1. WHEN the page loads THEN the system SHALL show the title screen "CANDY DIGGER" with the
   controls, and wait for Enter.
2. WHEN the player presses Enter on the title screen THEN a new game SHALL start with a
   score of 0, 3 lives and level 1.
3. WHEN the player presses P during play THEN the game SHALL pause, and P SHALL resume it.
4. WHEN the player loses a life THEN the system SHALL show a tombstone for 1.5 seconds.
5. WHEN lives remain after that THEN the player SHALL respawn at the start cell, with
   ghosts and fireballs cleared, the fireball recharged, and ghosts that were alive
   returned to the spawn queue.
6. WHEN no lives remain THEN the system SHALL show GAME OVER with the score, and Enter
   SHALL return to the title screen.

### 2. Levels
Acceptance criteria
1. A level SHALL end when every pumpkin is collected, or when every ghost for the level has
   spawned and been killed.
2. WHEN a level ends THEN the system SHALL show LEVEL CLEAR for 2 seconds, then load the next.
3. WHEN the last defined level is finished THEN the levels SHALL repeat, and ghost speed
   SHALL rise 10% for each completed cycle.
4. Level maps SHALL be 15 by 10 text grids, and the loader SHALL reject maps with the wrong
   size or unknown characters.

### 3. HUD and theme
Acceptance criteria
1. The HUD SHALL show the score, level number, remaining lives and fireball charge.
2. The game SHALL use a Halloween theme: ghosts, candy bags, spilled candy, pumpkins and dark
   purple soil.
3. All graphics SHALL be drawn with canvas shapes. There SHALL be no image or audio assets.

### 4. Delivery
Acceptance criteria
1. The game SHALL run from `npm run dev` on port 5173 and build with `npm run build`.
2. WHEN code is pushed to `main` THEN a GitHub Actions workflow SHALL build the game and
   publish it to GitHub Pages, once Pages is enabled in the repo settings.
3. The repository SHALL be licensed under MIT, and the README SHALL state that the game is
   an independent homage with no original assets.
