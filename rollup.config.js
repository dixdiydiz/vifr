import license from 'rollup-plugin-license'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';

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
  const config = {
    external: [/node_modules/],
    plugins: [
      nodeResolve({ extensions: [ '.ts'], }),
      commonjs(),
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfig: `${SOURCE_DIR}/tsconfig.json`
      }),
      licensePlugin('vifr'),
    ]
  }
  return [
    {
      input: [`${SOURCE_DIR}/src/cli.ts`, `${SOURCE_DIR}/src/index.ts`],
      output: {
        dir: OUTPUT_DIR,
        format: 'cjs',
        entryFileNames: `[name].js`,
        exports: "named",
      },
      ...config,
    }, {
      input: [`${SOURCE_DIR}/src/react/index.ts`],
      output: {
        dir: `${OUTPUT_DIR}/react`,
        format: 'es',
        entryFileNames: `[name].js`,
        exports: "named",
      },
      ...config,
    }
  ]
}



export default commandLineArgs => {
  return [
    vifr(commandLineArgs),
  ];
}