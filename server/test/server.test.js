const request = require('supertest')
const expect = require('expect')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const {Todo} = require('./../model/todo')
const {User} = require('./../model/user')
const {app} = require('./../server')
const {testTodos, setupTodoSeedData, testUsers, setupUserSeedData} = require('./../test/seed/seed')

beforeEach(setupTodoSeedData)
beforeEach(setupUserSeedData)

describe('post /todos', () => {
    it('should create new todo', (done) => {
        const text = 'somthing to test the post route'

        request(app)
        .post('/todos')
        .set('x-auth', testUsers[0].tokens[0].token)
        .send({
            text: text
        })
        .expect(200)
        .expect((res) => {
            res.body.text === text
        })
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }

            Todo.find({text}).then((res) => {
                expect(res[0].text).toBe(text)
                expect(res.length).toBe(1)
                done()
            }).catch((err) => {
                done(err)
            })
        })
    }).timeout(3000)

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', testUsers[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }

            Todo.find().then((res) => {
                res.length === 2
                done()
            }).catch((err) => {
                done(err)
            })
        })
    })
})

describe('get /todos', () => {
    it('should be list of all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.length).toEqual(1)
        })
        .end(done)
    })
})

describe('get /todos/:id', () => {
    it('should be the target todo', (done) => {
        request(app)
        .get(`/todos/${testTodos[0]._id.toHexString()}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body[0].text).toBe(testTodos[0].text)
        })
        .end(done)
    })

    it('can not send to which is for another user', (done) => {
        request(app)
        .get(`/todos/${testTodos[1]._id.toHexString()}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should be 404 for invalid id', (done) => {
        request(app)
        .get(`/todos/123`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should be 404 for cant find doc', (done) => {
        request(app)
        .get(`/todos/${new ObjectID}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
})

describe('delete /todo/:id', () => {
    it('should remove the target document', (done) => {
        request(app)
        .delete(`/todos/${testTodos[0]._id.toHexString()}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(testTodos[0].text)
        })
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }

            Todo.findById({
                _id: testTodos[0]._id
            })
            .then((doc) => {
                expect(doc).toNotExist()
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })

    it('should not remove another user todo', (done) => {
        request(app)
        .delete(`/todos/${testTodos[1]._id.toHexString()}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if (err) {
                done(err)
            }

            Todo.findById(testTodos[1]._id)
            .then((doc) => {
                expect(doc).toExist()
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })

    it('should be 404 because invaid id', (done) => {
        request(app)
        .delete('/todos/123')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should be 404 because id is not exist', (done) => {
        request(app)
        .delete(`/todos/${new ObjectID}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
})

describe('patch /todos/:id', () => {
    it('should update the todo', (done) => {
        request(app)
        .patch(`/todos/${testTodos[0]._id.toHexString()}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .send({
            text: 'updated from mocha',
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe('updated from mocha')
            expect(res.body.completed).toBe(true)
            expect(res.body.completedAt).toBeA('number')
        })
        .end(done)
    })

    it('should not let user to update another one tood', (done) => {
        request(app)
        .patch(`/todos/${testTodos[1]._id.toHexString()}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .send({
            text: 'updated from mocha',
            completed: false
        })
        .expect(404)
        .end(done)
    })

    it('should update the text and remove the completedAt when todo is not completed', (done) => {
        request(app)
        .patch(`/todos/${testTodos[1]._id.toHexString()}`)
        .set('x-auth', testUsers[1].tokens[0].token)
        .send({
            text: 'updated from mocha',
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe('updated from mocha')
            expect(res.body.completed).toBe(false)
            expect(res.body.completedAt).toNotExist()
        })
        .end(done)
    })
})

describe('get /users/me', () => {
    it('should send the data to authenticate user', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(testUsers[0]._id.toHexString())
            expect(res.body.email).toBe(testUsers[0].email)
        })
        .end(done)
    })

    it('should not send the data to not authentication user', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        })
        .end(done)
    })
})

describe('post /users', () => {
    it('should create a user', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'new@user.com',
            password: '1231231'
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist()
            expect(res.body._id).toExist()
            expect(res.body.email).toExist()
        })
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }
            
            User.findById(res.body._id).then((user) => {
                expect(user.password).toNotBe('1231231')
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })

    it('should return validation error because invalid request data', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'notvalidemail.com',
            password: '123'
        })
        .expect(400)
        .end(done)
    })

    it('shoud not create user because email is in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: testUsers[1].email,
            password: '1231231'
        })
        .expect(400)
        .end(done)
    })
})

describe('post /users/login', () => {
    const user = _.pick(testUsers[1], ['email', 'password'])

    it('should return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send(user)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(testUsers[1]._id.toHexString())
            expect(res.body.email).toBe(testUsers[1].email)
            expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }

            User.findById(testUsers[1]._id)
            .then((user) => {
                expect(user.tokens.length).toBe(2)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })

    it('should rejet invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: 'second@domain.com',
            password: 'notexist'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist()
            expect(res.body).toEqual({})
        })
        .end((err, res) => {
            if (err) {
                done(err)
            }

            User.findById(testUsers[1]._id)
            .then((user) => {
                expect(user.tokens.length).toBe(1)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})

describe('delete /users/me/token', () => {
    it('should delete token', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err)
            }

            User.findById(testUsers[0]._id)
            .then((res) => {
                expect(res.tokens.length).toBe(0)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
})