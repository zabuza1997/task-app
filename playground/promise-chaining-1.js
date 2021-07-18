// eb08e1a945f00fc4083608
require('../src/db/mongoose')
const Task = require('../src/models/task');

Task.findOneAndDelete('eb08e1a945f00fc4083608').then(task => {
    console.log(task);
    return Task.countDocuments({
        completed: true
    }).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })
})