const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {todo} = require('./../server/model/todo')
const {user} = require('./../server/model/user')

todo.remove({}).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})

todo.findOneAndRemove({
    _id: '5ba27f4ac72aa539d05156f2'
}).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})

todo.findByIdAndRemove({
    _id: '5ba27fa359a1b61848c37204'
}).then((res) => {
    console.log(res)
}).catch((err)=> {
    console.log(err)
})