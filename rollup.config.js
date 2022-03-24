import license from 'rollup-plugin-license'
import copy from 'rollup-plugin-copy'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { babel } from '@rollup/plugin-babel'

function getVersion(sourceDir) {
  return require(`./${sourceDir}/package.json`).version
}

function licensePlugin(libraryName) {
  const licenseText =
    `/**` +
    ` \n * ${libraryName} is released under the MIT license found in the` +
    ` \n * LICENSE.md file in the root directory of this source tree.` +
    ` \n *` +
    ` \n * @license MIT` +
    ` \n */`
  return license({
    banner: {
      content: licenseText
    },
    thirdParty: {
      includePrivate: true
    }
  })
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifr() {
  const SOURCE_DIR = 'packages/vifr'
  const OUTPUT_DIR = 'packages/vifr/dist'
  return [
    {
      input: [`${SOURCE_DIR}/src/cli.ts`, `${SOURCE_DIR}/src/index.ts`],
      output: {
        dir: OUTPUT_DIR,
        format: 'cjs',
        entryFileNames: `[name].js`,
        exports: 'named'
      },
      external: [/node_modules/],
      plugins: [
        nodeResolve({ extensions: ['.ts', '.tsx'] }),
        commonjs(),
        typescript({
          tsconfig: `${SOURCE_DIR}/tsconfig.json`,
          tsconfigOverride: {
            include: ['src/**/*.ts'],
            exclude: ['src/react/*'],
            compilerOptions: {
              outDir: OUTPUT_DIR
            }
          }
        }),
        licensePlugin('vifr')
      ]
    }
  ]
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifrReact() {
  const VIFR_DIR = 'packages/vifr'
  const SOURCE_DIR = `${VIFR_DIR}/src/react`
  const OUTPUT_DIR = `${VIFR_DIR}/dist/react`
  const virtualModuleReg = /@vifr-virtual/
  return [
    {
      input: [`${SOURCE_DIR}/index.ts`],
      output: {
        dir: OUTPUT_DIR,
        entryFileNames: `vifr-react.js`,
        exports: 'named',
        format: 'es'
      },
      external: [/node_modules/, /@babel\/runtime/, /^react/, virtualModuleReg],
      plugins: [
        nodeResolve({ extensions: ['.ts', '.tsx'] }),
        commonjs(),
        typescript({
          tsconfig: `${VIFR_DIR}/tsconfig.json`,
          tsconfigOverride: {
            include: ['src/react/*'],
            compilerOptions: {
              outDir: `${OUTPUT_DIR}`
            }
          }
        }),
        babel({
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          presets: [['@babel/preset-react', { runtime: 'automatic' }]],
          extensions: ['.ts', '.tsx'],
          plugins: ['@babel/plugin-transform-runtime']
        }),
        copy({
          targets: [
            { src: `${SOURCE_DIR}/package.json`, dest: `${OUTPUT_DIR}` }
          ]
        }),
        licensePlugin('vifr')
      ]
    }
  ]
}

export default (commandLineArgs) => {
  return [...vifr(commandLineArgs), ...vifrReact(commandLineArgs)]
}
