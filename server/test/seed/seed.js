const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../model/todo')
const {User} = require('./../../model/user')

const testUserIdOne = new ObjectID
const testUserIdTwo = new ObjectID
const testTodoIdOne = new ObjectID
const testTodoIdTwo = new ObjectID

const testUsers = [{
    _id: testUserIdOne,
    email: 'first@domain.com',
    password: '123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: testUserIdOne,
            access: 'auth'
        }, process.env.SALT)
    }]    
}, {
    _id: testUserIdTwo,
    email: 'second@domain.com',
    password: '123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: testUserIdTwo,
            access: 'auth'
        }, process.env.SALT)
    }]    
}]

const testTodos = [{
    _id: testTodoIdOne,
    text: 'first',
    _creator: testUserIdOne
}, {
    _id: testTodoIdTwo,
    text: 'second',
    completed: true,
    completedAt: 123,
    _creator: testUserIdTwo
}]

const setupUserSeedData = (done) =>{
    User.deleteMany().then(() => {
        const userOne = new User(testUsers[0]).save()
        const userTwo = new User(testUsers[1]).save()
    
        Promise.all([userOne, userTwo])
    }).then(() => {
        done()
    })
}

const setupTodoSeedData = (done) => {
    Todo.deleteMany()
    .then(() => {
        Todo.insertMany(testTodos)
    })
    .then(() => {
        done()
    })
}

module.exports = {
    testTodos,
    setupTodoSeedData,
    testUsers,
    setupUserSeedData
}