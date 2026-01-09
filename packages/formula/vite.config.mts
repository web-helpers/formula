import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.mts'),
        webcomponent: resolve(__dirname, 'src/lib/webcomponent/index.mts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => {
        return `${entryName}.mjs`;
      },
    },
    rollupOptions: {
      external: ['nanostores'],
      output: {
        preserveModules: true,
        preserveModulesRoot: '.',
        entryFileNames: '[name].mjs',
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
