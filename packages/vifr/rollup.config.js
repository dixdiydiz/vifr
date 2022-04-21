import license from 'rollup-plugin-license'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

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
      external: [/node_modules/, /^@vifr/],
      plugins: [
        nodeResolve({ extensions: ['.ts'] }),
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
        licensePlugin()
      ]
    }
  ]
}

export default (commandLineArgs) => {
  return [...vifr(commandLineArgs)]
}
