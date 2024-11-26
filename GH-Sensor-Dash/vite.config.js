import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ // Optional: for analyzing bundle sizes
      open: true, // Automatically open the visualization in the browser after build
      gzipSize: true, // Show gzip size
      brotliSize: true, // Show Brotli size
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Move node_modules dependencies into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor'; // Creates a vendor chunk for all node_modules
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1 MB
  },
});
