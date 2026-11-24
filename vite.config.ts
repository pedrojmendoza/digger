import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // relative asset paths so the build works under /digger/ on GitHub Pages
  server: { port: 5173, host: '127.0.0.1' },
});
