const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const {mongoose} = require('./db/mongoose')
const {todo} = require('./model/todo')
const {user} = require('./model/user')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    const newTodo = new todo({
        text: req.body.text
    })

    newTodo.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/todos', (req, res) => {
    todo.find().then((todos) => {
        res.send(todos)
    }, (err) => {
        res.status(400).send('invalid request')
    })
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        res.status(404).send()
        return
    }

    todo.findById(id)
    .then((doc) => {
        if (!doc) {
            res.status(404).send()
            return
        }

        res.send(doc)
    })
    .catch((err) => {
        res.status(400).send()
    })
})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
        return
    }

    todo.findByIdAndRemove(id)
    .then((doc) => {
        if (!doc) {
            res.status(404).send()
            return
        }

        res.send(doc)
    })
    .catch((err) => {
        res.status(400).send()
    })
})

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        res.status(404).send()
        return
    }

    const body = _.pick(req.body, ['text', 'completed'])

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completedAt = null
    }

    todo.findByIdAndUpdate(id, body, {
        new: true
    })
    .then((doc) => {
        if (!doc) {
            res.status(404).send()
            return
        }

        res.send(doc)
    })
    .catch((err) => {
        res.status(400).send()  
    })
})

app.listen(port, () => {
    console.log(`connected to port ${port}`)
})

module.exports = {
    app
}

// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost:27017/todoApp')

// const todo = mongoose.model('todo', {
//     title: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1
//     },
//     completed: {
//         type: Boolean,
//         default: false 
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// })

// const newTodo = new todo({
//     title: 'just do it'
// })

// newTodo.save().then((res) => {
//     console.log('saved in db,', JSON.stringify(res, null, 2))
// }, (err) => {
//     console.log('unable to save in db ')
// })

// const user = mongoose.model('user', {
//     email: {
//         type: String,
//         require: true,
//         trim: true,
//         minlength: 1
//     }
// })

// const newUser = new user({
//     email: 'email@email.com'
// })

// newUser.save().then((res) => {
//     console.log('saved in db', JSON.stringify(res, null, 2))
// }, (err) => {
//     console.log('unable to save in db')
// })