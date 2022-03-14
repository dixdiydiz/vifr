// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'max-len': [
      'error',
      {
        code: 80,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true
      }
    ],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-empty': ['warn', { allowEmptyCatch: true }],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-var-requires': 0
  }
})
