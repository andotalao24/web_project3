import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config: React plugin + proxy so /api calls reach the Express
// backend on port 5000 during development (replaces CRA's "proxy" field).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
