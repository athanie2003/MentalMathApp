import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces for phone access on local Wi-Fi
    port: 3000
  }
});
