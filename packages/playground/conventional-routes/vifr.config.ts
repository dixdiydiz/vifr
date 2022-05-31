import { defineConfig } from 'vifr'

export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime']
  },
  routes: {
    suffix: ''
  },
  plugins: [],
  build: {
    minify: false
  }
})
