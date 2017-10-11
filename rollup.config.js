import resolve from 'rollup-plugin-node-resolve'
import builtIns from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import json from 'rollup-plugin-json'
import postcssModules from 'postcss-modules'
import postcssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'
import FastlyPurge from 'fastly-purge'
import sizes from 'rollup-plugin-sizes'

// `npm run --production build` -> `production` is true
// `npm run dev` -> `production` is false

const production = process.env.NODE_ENV === 'production'
const { TRAVIS_BRANCH, TRAVIS_BUILD_NUMBER, TRAVIS_TAG } = process.env

let deployDir = 'public'
if (TRAVIS_BUILD_NUMBER) {
    const s3Domain = `your.scripts.com`
    const s3Bucket = 'your-bucket'
    // set up the build dir which will be pushed to s3
    // .travis.yml configures s3 to push anything in public/
    const s3Path = TRAVIS_TAG ? `/${TRAVIS_TAG}` : `/${TRAVIS_BRANCH}/${TRAVIS_BUILD_NUMBER}`
    // if we build a tag, we want to purge
    if (TRAVIS_TAG) {
        const fastlyPurge = new FastlyPurge()
        const filesToPurge = [`bundle.js`, `bundle.js.map`]
        filesToPurge.forEach(file => {
            fastlyPurge.url(`http://${s3Domain}/${s3Bucket}${s3Path}/${file}`, () => {})
            fastlyPurge.url(`https://${s3Domain}/${s3Bucket}${s3Path}/${file}`, () => {})
        })
    }
    deployDir += s3Path
}

const cssExportMap = {}
export default {
    input: 'src/main.js',
    output: {
        file: `${deployDir}/bundle.js`,
        format: 'iife',
    }, // immediately-invoked function expression — suitable for <script> tags
    plugins: [
        // tells Rollup how to find node_modules
        resolve({
            // whether to prefer built-in modules (e.g. `fs`, `path`) or
            // local ones with the same names
            preferBuiltins: true, // Default: true (specify explicitly to disable warning)
        }),
        postcss({
            plugins: [
                autoprefixer(),
                postcssModules({
                    getJSON(id, exportTokens) {
                        cssExportMap[id] = exportTokens
                    },
                }),
                postcssNested(),
            ],
            getExportNamed: true, // Default false, when set to true it will also named export alongside default export your class names
            getExport(id) {
                return cssExportMap[id]
            },
            // sourceMap: false, // default value
            // extract: false, // default value
            extensions: ['.css'], // default value
            // parser: sugarss
        }),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
            runtimeHelpers: true,
        }),
        json(),
        commonjs(), // converts node_modules to ES modules
        globals(),
        builtIns(),
        production && sizes(),
        production && uglify(), // minify, but only in production
    ],
    sourcemap: true,
    watch: {
        include: 'src/**',
    },
    onwarn: message => {
        if (message.code === 'MISSING_EXPORT') return
        console.error(message)
    },
}
