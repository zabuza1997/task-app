const add = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(a + b)
        }, 2000);
    })
}

// add(1, 2).then((sum) => {
//     console.log(sum);
//     add(sum, 5).then(sum1 => {
//         console.log(sum1)
//     }).catch(error => {
//         console.log(error)
//     })
// }).catch(error => {
//     console.log(error)
// })
add(1, 2).then(sum => {
    console.log(sum);
    return add(sum, 6);
}).then(sum1 => {
    console.log(sum1);
}).catch(error => {
    console.log(error)
})