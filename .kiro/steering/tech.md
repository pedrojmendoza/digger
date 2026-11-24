# Tech stack and commands

- TypeScript (strict), HTML5 Canvas 2D, Vite. No game framework, no runtime dependencies.
- No image or audio assets yet. Sprites are drawn with canvas shapes in `src/renderer.ts`.
- Node 18+ (developed on Node 22).

Commands:
- `npm install`
- `npm run dev`: dev server on http://127.0.0.1:5173 (port and host set in `vite.config.ts`)
- `npm run typecheck`: `tsc --noEmit`
- `npm run build`: typecheck, then production bundle in `dist/`

Deployment: `.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push
to `main`. `vite.config.ts` uses `base: './'` so the build works under `/digger/`.

There is no automated test suite yet. Verify changes with `npm run build` and by playing.
