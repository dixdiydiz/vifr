import license from 'rollup-plugin-license'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';

function getVersion(sourceDir) {
  return require(`./${sourceDir}/package.json`).version;
}

function licensePlugin (libraryName) {
  const licenseText =
    `/**` +
    ` * ${libraryName} is released under the MIT license found in the` +
    ` * LICENSE.md file in the root directory of this source tree.` +
    ` *` +
    ` * @license MIT` +
    ` */`
  return license({
    banner: {
      content: licenseText
    },
    thirdParty: {
      includePrivate: true,
    }
  })
}


/**
 * @type {import('rollup').RollupOptions[]}
 */
function vifr () {
  const SOURCE_DIR = "packages/vifr"
  const OUTPUT_DIR = "packages/vifr/dist"
  const vifrModule = { include: ["src/"] };
  return [
    {
      input: [`${SOURCE_DIR}/src/cli.ts`, `${SOURCE_DIR}/src/index.ts`],
      output: {
        dir: OUTPUT_DIR,
        format: 'cjs',
        entryFileNames: `[name].js`,
        exports: "named",
      },
      external: [/node_modules/],
      plugins: [
        nodeResolve({ extensions: [ '.ts', '.tsx'], }),
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
        licensePlugin('vifr'),
      ],
    }, {
      input: [`${SOURCE_DIR}/src/react/index.ts`],
      output: {
        dir: `${OUTPUT_DIR}/react`,
        format: 'es',
        entryFileNames: `[name].js`,
        exports: "named",
      },
      external: [/node_modules/, /@babel\/runtime/, /^react/],
      plugins: [
        nodeResolve({ extensions: [ '.ts', '.tsx'], }),
        commonjs(),
        typescript({
          tsconfig: `${SOURCE_DIR}/tsconfig.json`,
          tsconfigOverride: {
            include: ['src/react/*'],
            compilerOptions: {
              outDir: `${OUTPUT_DIR}/react`
            }
          }
        }),
        babel({
          babelHelpers: "runtime",
          exclude: /node_modules/,
          presets: ['@babel/preset-react'],
          extensions: ['.ts', '.tsx'],
          plugins: [
            "@babel/plugin-transform-runtime"
          ]
        }),
        licensePlugin('vifr'),
      ],
    }
  ]
}



export default commandLineArgs => {
  return [
    ...vifr(commandLineArgs),
  ];
}