const mongoose = require('mongoose')

const user = mongoose.model('user', {
    email: {
        required: true,
        type: String,
        minlength: 1,
        trim: true
    }
})

module.exports = {
    user
}