const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const port = process.env.PORT || 3000;
const app = express();
// app.use((req, res, next) => {
//     res.status(503).send('Server maintenance. Please comeback later!')
// })
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//     const token = await jwt.sign({
//         _id: '123abc'
//     }, 'fucklife123', {
//         expiresIn: '1h'
//     });
//     console.log(token)

//     const data = await jwt.verify(token, 'fucklife123');
//     console.log(data);
// }
// myFunction();