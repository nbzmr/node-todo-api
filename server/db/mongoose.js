const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds131151.mlab.com:31151/todos', {useNewUrlParser: true} || 'mongodb://localhost:27017/todoApp', {useNewUrlParser: true})

module.exports = {
    mongoose
}
