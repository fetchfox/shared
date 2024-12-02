import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Remove if not using React

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  esbuild: {
    jsx: 'automatic', // Enables the modern React JSX transform
  },
  plugins: [react()], // Add plugins as needed
  build: {
    minify: 'esbuild', // Ensure minification to avoid dev artifacts
    sourcemap: false,
    emptyOutDir: true,
    lib: {
      entry: 'src/index.js', // Entry point for your library
      name: 'fetchfox-shared',
      fileName: 'fetchfox-shared',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
});
