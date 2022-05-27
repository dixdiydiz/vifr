// https://github.com/playwright-community/eslint-plugin-playwright
// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:playwright/playwright-test'
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
    quotes: 0,
    'no-empty': ['warn', { allowEmptyCatch: true }],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0
  }
})
