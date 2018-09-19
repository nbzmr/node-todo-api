const mongoose = require('mongoose')

const todo = mongoose.model('todo', {
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

    }
})

module.exports = {
    todo
}