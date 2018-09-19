const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {todo} = require('./../server/model/todo')
const {user} = require('./../server/model/user')

const id = '5ba10e2fe0eb9921b8fc9920'

if(!ObjectID.isValid(id)) {
    console.log('id is not valid')
}


user.find({
    _id: id
})
.then((res) => {
    if (!res) {
        console.log('id is not exist')
        return
    }
    console.log(JSON.stringify(res, null, 2))
})
.catch((err) => {
    console.log(err)
})


user.findOne({
    _id: id
})
.then((res) => {
    if (!res) {
        console.log('id is not exist')
        return
    }
    console.log(JSON.stringify(res, null, 2))
})
.catch((err) => {
    console.log(err)
})


user.findById(id)
.then((res) => {
    if (!res) {
        console.log('id is not exist')
        return
    }
    console.log(JSON.stringify(res, null, 2))
})
.catch((err) => {
    console.log(err)
})