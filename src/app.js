import css from './app.css'
const testPromise = () =>
    new Promise(resolve => {
        setTimeout(function() {
            resolve('workin')
        }, 1000)
    })

const app = el => {
    testPromise().then(result => {
        console.log(`app.js:10 result:`, result)
        el.className = css.testCss
        el.innerText = result
    })
}
export default app
