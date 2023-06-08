import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'routing-pattern'
    },
    rollupOptions: {
      output: [
        {
          dir: 'dist',
          format: 'esm'
        },
        {
          dir: 'dist',
          format: 'cjs'
        }
      ]
    }
  }
})
