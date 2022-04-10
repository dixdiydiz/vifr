// todo:
// react plugin bug: https://github.com/vitejs/vite/pull/7246
// https://github.com/vitejs/vite/issues/6215
/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  optimizeDeps: {
    include: ['react/jsx-runtime']
  },
  routes: {
    suffix: 'route',
    caseSensitive: false
  },
  plugins: [],
  build: {
    minify: false
  }
}
