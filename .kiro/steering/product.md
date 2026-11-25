# Candy Digger: product overview

The game is called Candy Digger (the GitHub repo is still named `digger`). It is a browser
homage to the 1983 arcade game Digger with a Halloween theme.

Legal: keep all code and art original. Do not import code, graphics, sound or levels from the
original game or from remakes (Digger Remastered is GPL). Keep the README disclaimer.
 The player tunnels
through dark soil, collects pumpkins, pushes and drops candy bags, and avoids or kills ghosts.

Theme mapping: code names stay as in the original game. Emerald = pumpkin, Bag = candy bag,
gold pile = spilled candy, Enemy (Nobbin) = ghost. Keep the code names, change only visuals
and player-facing text.

Current scope is a playable prototype that should grow into a full game. Not built yet:
ghosts that dig (the original Hobbins), bonus item, sound, high scores, more levels, touch controls.

Game rules live in `src/game.ts` and `src/entities/`. Tunable numbers (speeds, timings,
scores) belong in `src/config.ts`, not inline.
