import license from 'rollup-plugin-license'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { babel } from '@rollup/plugin-babel'

const pkg = require(`./package.json`)

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

/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifrReact(commandLineArgs) {
  const isProduction = !commandLineArgs.watch
  const OUTPUT_DIR = 'dist'
  const virtualModuleReg = /@vifr-virtual/
  return [
    {
      input: ['src/index.ts'],
      output: {
        dir: OUTPUT_DIR,
        entryFileNames: `[name].js`,
        exports: 'named',
        format: 'es'
      },
      external: [
        /node_modules/,
        'vifr',
        /^@vifr/,
        /@babel\/runtime/,
        /^react/,
        virtualModuleReg
      ],
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

export default (commandLineArgs, prefix) => {
  return [...vifrReact(commandLineArgs, prefix)]
}
