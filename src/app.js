import css, { aColor } from './app.css'
import { isArray } from 'lodash'
const testPromise = () =>
    new Promise(resolve => {
        setTimeout(function() {
            resolve('workin')
        }, 1000)
    })

const app = el => {
    testPromise().then(result => {
        console.log(`app.js:10 result:`, result)
        console.log(`app.js:13`, isArray([]), `isArray([])`)
        console.log(`app.js:14`, aColor, `aColor`)
        el.className = css.testCss
        el.innerText = result
    })
}
export default app
