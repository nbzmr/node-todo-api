const mongoose = require('mongoose')

const Todo = mongoose.model('todo', {
    text: {
        required: true,
        trim: true,
        minlength: 1,
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null

    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = {
    Todo
}