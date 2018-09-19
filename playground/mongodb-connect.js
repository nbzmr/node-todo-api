// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

const id = new ObjectID()
console.log(id)

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
    if(err) {
        console.log('unable to connect to database server')
        return null
    }
    console.log('connect to database server succesfully')

    const db = client.db('todoApp')

    db.collection('todos').insertOne({
        text: 'somthing todo',
        completed: false
    }, (err, result) => {
        if(err) {
            console.log('unable to insert data into the database', err)
            return
        }
        console.log(JSON.stringify(result.ops, null, 2))
    })

    db.collection('users').insertOne({
        name: 'mike',
        age: 27,
        location: 'somewhere'
    }, (err, result) => {
        if(err) {
            console.log('unable to insert data', err)
            return null
        }
        console.log(JSON.stringify(result.ops, null, 2))
        console.log(result.ops[0]._id.getTimestamp())
    })

    // client.close()
})