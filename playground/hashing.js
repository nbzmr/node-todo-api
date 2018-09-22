const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// concept of using "bcrypt"

const password = 'something'
let hashValue

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash)
        hashValue = hash
        
        bcrypt.compare(password, hashValue, (err, res) => {
            console.log(res)
        })
    })
})

// concept of "crypto-js" with "SHA256" algorithm

const plainText = 'some string'

const hash = SHA256(plainText).toString()
const secondHash = SHA256(hash).toString()

console.log(secondHash)

// concept of using "jwt" with default algorithm

const data = {
    id: 10
}

const token = jwt.sign(data, '123')
console.log('token', token)

const decoded = jwt.verify(token, '123')
console.log('decoded', decoded)

// concept of behinde "jwt"

const dataa = {
    id: 4
}

const tokenn = {
    dataa,
    hash: SHA256(JSON.stringify(dataa) + 'some salt').toString()
}



// tokenn.dataa = 5
// tokenn.hash = SHA256(JSON.stringify(token.dataa)).toString()



const resultHash = SHA256(JSON.stringify(tokenn.dataa) + 'some salt').toString()
if (resultHash === tokenn.hash) {
    console.log('data was not changed')
} else {
    console.log('data was changed')
}