const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
    if(err) {
        console.log('unable to connect to server', err)
        return null
    }
    console.log('connected to server successfully')

    const db = client.db('todoApp')

    // db.collection('users').deleteOne({
    //     _id: new ObjectID('5b9a324f27230fd56d7cde18')
    // }).then((res) => {
    //     console.log(res)
    // })

    db.collection('users').findOneAndDelete({
        _id: new ObjectID('5b9a4ade27230fd56d7ce36c')
    }).then((res) => {
        console.log(JSON.stringify(res, null, 2))
    })

    // db.collection('users').deleteMany({
    //     name: 'mike'
    // }).then((res) => {
    //     console.log(res)
    // })
    
    // client.close()
})