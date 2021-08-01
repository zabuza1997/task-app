const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const port = process.env.PORT || 3000;
const app = express();
// app.use((req, res, next) => {
//     res.status(503).send('Server maintenance. Please comeback later!')
// })
const multer = require('multer');
const upload = multer({
    dest: 'images'
})
app.post('/upload', (req, res) => {
    res.send
})
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})
// const Task = require('./models/task');
// const User = require('./models/user');
// const main = async () => {
//     const user = await User.findById('60f45561e67b1228d0a21ffc');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks)
// }
// main();
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