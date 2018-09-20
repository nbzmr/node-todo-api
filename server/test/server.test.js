const request = require('supertest')
const expect = require('expect')
const {ObjectID} = require('mongodb')

const {todo} = require('./../model/todo')
const {app} = require('./../server')

const testTodos = [{
    _id: new ObjectID,
    text: 'first'
}, {
    _id: new ObjectID,
    text: 'second',
    completed: true,
    completedAt: 123
}]

beforeEach((done) => {
    todo.deleteMany().then((res) => {
        todo.insertMany(testTodos)
    }).then((res) => {
        done()
    })
})

describe('post /todos', () => {
    it('should create new todo', (done) => {
        const text = 'somthing to test the post route'

        request(app)
        .post('/todos')
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

            todo.find({text}).then((res) => {
                expect(res[0].text).toBe(text)
                expect(res.length).toBe(1)
                done()
            }).catch((err) => {
                done(err)
            })
        })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }

            todo.find().then((res) => {
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
        .expect(200)
        .expect((res) => {
            expect(res.body.length).toEqual(2)
        })
        .end(done)
    })
})

describe('get /todos/:id', () => {
    it('should be the target todo', (done) => {
        request(app)
        .get(`/todos/${testTodos[1]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(testTodos[1].text)
        })
        .end(done)
    })

    it('should be 404 for invalid id', (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done)
    })

    it('should be 404 for cant find doc', (done) => {
        request(app)
        .get(`/todos/${new ObjectID}`)
        .expect(404)
        .end(done)
    })
})

describe('delete /todo/:id', () => {
    it('should remove the target document', (done) => {
        request(app)
        .delete(`/todos/${testTodos[1]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(testTodos[1].text)
        })
        .end((err, res) => {
            if (err) {
                done(err)
                return
            }

            todo.findById({
                _id: testTodos[1]._id
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

    it('should be 404 because invaid id', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)
    })

    it('should be 404 because id is not exist', (done) => {
        request(app)
        .delete(`/todos/${new ObjectID}`)
        .expect(404)
        .end(done)
    })
})

describe('patch /todos/:id', () => {
    it('should update the todo', (done) => {
        request(app)
        .patch(`/todos/${testTodos[0]._id.toHexString()}`)
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

    it('should update the text and remove the completedAt when todo is not completed', (done) => {
        request(app)
        .patch(`/todos/${testTodos[1]._id.toHexString()}`)
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