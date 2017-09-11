import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
    entry: 'src/main.js',
    dest: 'public/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    plugins: [
        resolve(), // tells Rollup how to find node_modules
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
