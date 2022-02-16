import path from 'path'
import  fs from 'fs'
import license from 'rollup-plugin-license'
import nodeResolve from '@rollup/plugin-node-resolve'
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
      output() {
        fs.writeFileSync('LICENSE.md', licenseText)
      }
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
    input: [`${SOURCE_DIR}/cli.ts`, `${SOURCE_DIR}/index.ts`],
    external: true,
    output: {
      dir: OUTPUT_DIR,
      exports: 'named',
      format: 'cjs',
    },
    plugins: [
      typescript({
        tsconfig: `${SOURCE_DIR}/tsconfig.json`
      }),
      nodeResolve({ extensions: [".ts"] }),
      licensePlugin('@vifr/server'),
    ]
  }
}




export default commandLineArgs => {
  return [
    vifrServer(commandLineArgs),
  ];
}