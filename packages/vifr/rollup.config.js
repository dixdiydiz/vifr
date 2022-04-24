import license from 'rollup-plugin-license'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { babel } from '@rollup/plugin-babel'
import copy from 'rollup-plugin-copy'

const pkg = require('./package.json')

function licensePlugin() {
  const licenseText =
    `/**` +
    ` \n * ${pkg.name}@v${pkg.version} is released under the MIT license found in the` +
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

const shareConfig = {
  external(isProduction) {
    return [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
      /@vifr/
    ]
  }
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifr(commandLineArgs) {
  const isProduction = !commandLineArgs.watch
  const OUTPUT_DIR = 'dist'
  return [
    {
      input: ['src/cli.ts', 'src/index.ts'],
      output: {
        dir: OUTPUT_DIR,
        format: 'cjs',
        entryFileNames: `[name].js`,
        exports: 'named'
      },
      external: [...shareConfig.external(isProduction)],
      plugins: [
        nodeResolve({ extensions: ['.ts', '.tsx'] }),
        commonjs(),
        typescript({
          tsconfig: `./tsconfig.json`,
          tsconfigOverride: {
            compilerOptions: Object.assign(
              {
                outDir: `${OUTPUT_DIR}`
              },
              isProduction
                ? {
                    sourceMap: false,
                    declaration: false
                  }
                : {
                    sourceMap: true,
                    declaration: true
                  }
            )
          }
        }),
        babel({
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          presets: [['@babel/preset-react', { runtime: 'automatic' }]],
          extensions: ['.ts', '.tsx'],
          plugins: ['@babel/plugin-transform-runtime']
        }),
        licensePlugin()
      ]
    }
  ]
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifrReact(commandLineArgs) {
  const isProduction = !commandLineArgs.watch
  const SOURCE_DIR = 'src/react'
  const OUTPUT_DIR = 'dist/react'
  return [
    {
      input: [`${SOURCE_DIR}/index.ts`],
      output: {
        dir: `${OUTPUT_DIR}`,
        format: 'esm',
        entryFileNames: `[name].js`,
        exports: 'named'
      },
      external: [...shareConfig.external(isProduction)],
      plugins: [
        nodeResolve({ extensions: ['.ts', '.tsx'] }),
        commonjs(),
        typescript({
          tsconfig: `./tsconfig.json`,
          tsconfigOverride: {
            compilerOptions: Object.assign(
              {
                outDir: `${OUTPUT_DIR}`
              },
              isProduction
                ? {
                    sourceMap: false,
                    declaration: false
                  }
                : {
                    sourceMap: true,
                    declaration: true
                  }
            )
          }
        }),
        babel({
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          presets: [['@babel/preset-react', { runtime: 'automatic' }]],
          extensions: ['.ts', '.tsx'],
          plugins: ['@babel/plugin-transform-runtime']
        }),
        licensePlugin(),
        copy({
          targets: [
            {
              src: `${SOURCE_DIR}/package.json`,
              dest: OUTPUT_DIR
            }
          ]
        })
      ]
    }
  ]
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifrDev(commandLineArgs) {
  const isProduction = !commandLineArgs.watch
  const OUTPUT_DIR = 'dist/dev'
  return [
    {
      input: ['src/dev/index.ts'],
      output: {
        dir: `${OUTPUT_DIR}`,
        format: 'cjs',
        entryFileNames: `[name].js`,
        exports: 'named'
      },
      external: [...shareConfig.external(isProduction)],
      plugins: [
        nodeResolve({ extensions: ['.ts', '.tsx'] }),
        commonjs(),
        typescript({
          tsconfig: `./tsconfig.json`,
          tsconfigOverride: {
            compilerOptions: Object.assign(
              {
                outDir: `${OUTPUT_DIR}`
              },
              isProduction
                ? {
                    sourceMap: false,
                    declaration: false
                  }
                : {
                    sourceMap: true,
                    declaration: true
                  }
            )
          }
        }),
        babel({
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          presets: [['@babel/preset-react', { runtime: 'automatic' }]],
          extensions: ['.ts', '.tsx'],
          plugins: ['@babel/plugin-transform-runtime']
        }),
        licensePlugin()
      ]
    }
  ]
}

export default (commandLineArgs) => {
  return [
    ...vifr(commandLineArgs),
    ...vifrReact(commandLineArgs),
    ...vifrDev(commandLineArgs)
  ]
}
