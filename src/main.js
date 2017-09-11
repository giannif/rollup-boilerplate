import app from './app.js'

const el = document.querySelector('#target')
console.log(`main.js:5 spread`, [...[1, 2, 3]])
app(el)
