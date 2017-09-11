const testPromise = () =>
    new Promise(resolve => {
        setTimeout(function() {
            resolve('workin')
        }, 1000)
    })

const app = () => {
    testPromise().then(result => console.log(`app.js:10 result:`, result))
}
export default app
