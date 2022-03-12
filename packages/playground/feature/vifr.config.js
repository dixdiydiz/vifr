/**
 * @type {import('vite').UserConfig}
 */

// todo:
// react plugin bug: https://github.com/vitejs/vite/pull/7246
// https://github.com/vitejs/vite/issues/6215
module.exports = {
  optimizeDeps: {
    include:  ['react/jsx-runtime']
  },
  plugins: [],
  build: {
    minify: false
  }
}
