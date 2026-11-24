// Grid and canvas dimensions
export const TILE = 48;
export const COLS = 15;
export const ROWS = 10;
export const HUD_H = 48;
export const WIDTH = COLS * TILE;
export const HEIGHT = ROWS * TILE + HUD_H;

// Speeds are in cells per second
export const PLAYER_SPEED = 3.5;
export const BAG_FALL_SPEED = 7;
export const FIREBALL_SPEED = 9;

// Timings are in seconds
export const BAG_WOBBLE_TIME = 0.7;
export const FIREBALL_COOLDOWN = 6;
export const DEATH_TIME = 1.5;
export const LEVEL_CLEAR_TIME = 2;

// Rules
export const START_LIVES = 3;
export const BAG_BREAK_HEIGHT = 2; // cells a bag must fall to break open
export const EMERALD_STREAK = 8;

export const SCORE = {
  emerald: 25,
  emeraldStreak: 250,
  gold: 500,
  enemyKill: 250,
} as const;
