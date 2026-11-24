# Digger: product overview

A browser remake of the 1983 arcade game Digger. The player tunnels through dirt, collects
emeralds, pushes and drops gold bags, and avoids or kills enemies.

Current scope is a playable prototype that should grow into a full game. Not built yet:
Hobbins (enemies that dig), bonus cherry, sound, high scores, more levels, touch controls.

Game rules live in `src/game.ts` and `src/entities/`. Tunable numbers (speeds, timings,
scores) belong in `src/config.ts`, not inline.
