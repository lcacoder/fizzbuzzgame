import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Add Jest plugin here
  build: {
    outDir: 'dist',
  },
  esbuild: {
    target: 'esnext',
  },
});
