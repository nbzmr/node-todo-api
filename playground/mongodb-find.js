const mongodb = require('mongodb')
const {MongoClient, ObjectID} = mongodb

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
    if(err) {
        console.log('unable to connect to database server', err)
        return null
    }
    console.log('connected to server successfully')

    const db = client.db('todoApp')

    // db.collection('todos').find({
    //     completed: false,
    //     _id: new ObjectID('5b97e4a2d007f04d9860bbde')
    // }).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, null, 2))
    // }, (err) => {
    //     console.log('unable to fetch the data', err)
    // })

    // db.collection('users')
    // .find({
    //     name: 'mike',
    //     _id: new ObjectID('5b97e4a2d007f04d9860bbdf')
    // })
    // .toArray()
    // .then((docs) => {
    //     console.log(JSON.stringify(docs, null, 2))
    // }, (err) => {
    //     console.log('unable to find the data', err)
    // })

    db.collection('users')
    .find({
        _id: new ObjectID('5b98d14f27230fd56d7cb5bc'),
        name: 'mike'
    })
    .count()
    .then((count) => {
        console.log(count)
    },(err) => {
        console.log(err)
    })

    // client.close()
})