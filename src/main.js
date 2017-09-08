import update from './update.js'

// even though Rollup is bundling all your files together, errors and
// logs will still point to your original source modules
console.log(`main.js:5 `, [...[1, 2, 3]])
update()
