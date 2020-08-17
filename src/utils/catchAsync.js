
/*
    - for catching errors in async functions
    - last argument in the func must be the next callback function
*/
module.exports = fn => {
    return (...args) => {
        const next = args[args.length - 1]
        fn(...args).catch(next)
    }
}