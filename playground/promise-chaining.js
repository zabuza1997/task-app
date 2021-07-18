require('../src/db/mongoose');
const User = require('../src/models/user')
// 60eb05a719e23715e083a962
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {
        age
    });
    const count = await User.countDocuments({
        age
    });
    return count;
}
updateAgeAndCount('60eb05a719e23715e083a962', 5).then(count => {
    console.log(count)
}).catch(error => {
    console.log(error)
})