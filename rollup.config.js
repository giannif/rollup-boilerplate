import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import postcssModules from 'postcss-modules'
import autoprefixer from 'autoprefixer'

// `npm run --production build` -> `production` is true
// `npm run dev` -> `production` is false

const production = process.env.NODE_ENV === 'production'

const cssExportMap = {}
export default {
    entry: 'src/main.js',
    dest: 'public/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    plugins: [
        resolve(), // tells Rollup how to find node_modules
        postcss({
            plugins: [
                autoprefixer(),
                postcssModules({
                    getJSON(id, exportTokens) {
                        cssExportMap[id] = exportTokens
                    },
                }),
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
        }),
        commonjs(), // converts node_modules to ES modules
        production && uglify(), // minify, but only in production
    ],
    sourceMap: true,
    watch: {
        include: 'src/**',
    },
    onwarn: message => {
        if (message.code === 'MISSING_EXPORT') return
        console.error(message)
    },
}
