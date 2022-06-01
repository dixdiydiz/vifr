// https://jestjs.io/docs/configuration
// https://kulshekhar.github.io/ts-jest/docs/
import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        // useESM: true,
      }
    },
    verbose: false,
    testMatch: [
      '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    testPathIgnorePatterns: ['/__e2e__/']
  }
}
