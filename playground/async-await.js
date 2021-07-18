const add = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return rej('Numbers must be non-neg')
            }
            res(a + b)
        }, 2000);
    })
}
const doWork = async () => {
    const sum = await add(1, 9);
    const sum1 = await add(sum, 10);
    const sum2 = await add(sum1, -99);
    return sum2;
}

doWork().then(result => {
    console.log("Result", result)
}).catch(error => {
    console.log("Error", error)
})