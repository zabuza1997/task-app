//CRUD create read update delete
const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
const {
    MongoClient,
    ObjectID
} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'data-app';



MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        return console.log(error)
    }
    const db = client.db(databaseName);

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(result => console.log('success', result)).catch(error => console.log('failure', error))
    db.collection('users').deleteOne({
        _id: ObjectID("60deeaebe019d82d2014977f")
    }).then(result => console.log(result.deletedCount)).catch(error => console.log(error))
})