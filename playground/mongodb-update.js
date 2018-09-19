const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
    if (err) {
        console.log('unable to connect to mongodb server')
        return null
    }
    console.log('connected to mongodb server')

    const db = client.db('todoApp')

    db.collection('todos').findOneAndUpdate({
        _id: new ObjectID('5b9a323027230fd56d7cde0f')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(JSON.stringify(res, null, 2))
    })

    db.collection('users').findOneAndUpdate({
        _id: new ObjectID('5b9a4ae027230fd56d7ce36e')
    }, {
        $inc: {
            age: -5 
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(JSON.stringify(res, null, 2))
    })

    // client.close()
})