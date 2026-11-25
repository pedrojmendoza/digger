# Digger: product overview

A browser remake of the 1983 arcade game Digger with a Halloween theme. The player tunnels
through dark soil, collects pumpkins, pushes and drops candy bags, and avoids or kills ghosts.

Theme mapping: code names stay as in the original game. Emerald = pumpkin, Bag = candy bag,
gold pile = spilled candy, Enemy (Nobbin) = ghost. Keep the code names, change only visuals
and player-facing text.

Current scope is a playable prototype that should grow into a full game. Not built yet:
ghosts that dig (the original Hobbins), bonus item, sound, high scores, more levels, touch controls.

Game rules live in `src/game.ts` and `src/entities/`. Tunable numbers (speeds, timings,
scores) belong in `src/config.ts`, not inline.
