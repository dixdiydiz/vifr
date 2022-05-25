// https://jestjs.io/docs/configuration
import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'jest-playwright-preset',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: ['**/__e2e__/**/?(*.)+(spec|test).[jt]s?(x)'],
    setupFilesAfterEnv: ['<rootDir>/script/jestSetupFilesAfterEnv.js']
  }
}
