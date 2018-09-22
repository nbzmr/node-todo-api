const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        required: true,
        type: String,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', function (next) {
    const user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const publicData = _.pick(user, ['_id', 'email'])
    
    return publicData
}

userSchema.methods.generateAuthToken = function () {
    const user = this
    const access = 'auth'
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access: access
    }, 'somesalt').toString()
    
    user.tokens = user.tokens.concat([{access, token}])

    return user.save().then(() => {
        return token
    })
}

userSchema.statics.findByToken = function (token) {
    const User = this
    let decoded

    try {
        decoded = jwt.verify(token, 'somesalt')
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject('error message')
        })

        return Promise.reject('error message')
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.access': decoded.access,
        'tokens.token': token
    })
}

const User = mongoose.model('user', userSchema)

module.exports = {
    User
}