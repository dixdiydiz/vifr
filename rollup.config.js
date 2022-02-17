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
 * @type {import('rollup').RollupOptions}
 */
function vifrServer () {
  const SOURCE_DIR = "packages/vifr-server"
  const OUTPUT_DIR = "packages/vifr-server/dist"
  return {
    external: [/node_modules/],
    input: [`${SOURCE_DIR}/src/cli.ts`, `${SOURCE_DIR}/src/index.ts`],
    output: {
      dir: OUTPUT_DIR,
      format: 'cjs',
      entryFileNames: `[name].js`,
      exports: "named",
    },
    plugins: [
      nodeResolve({ extensions: [ '.ts'] }),
      commonjs(),
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfig: `${SOURCE_DIR}/tsconfig.json`
      }),
      licensePlugin('@vifr/server'),
    ]
  }
}



export default commandLineArgs => {
  return [
    vifrServer(commandLineArgs),
  ];
}