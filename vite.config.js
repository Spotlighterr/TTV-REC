import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    watch: {
      ignored: ['**/tmp/**', '**/dist/**', '**/node_modules/**', '**/assets/textures/**', '**/assets/models/**'],
      usePolling: process.platform === 'win32',
      interval: 250,
    },
  },
});
