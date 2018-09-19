const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const port = {
    local: 'mongodb://localhost:27017/todoApp',
    mlab: 'mongodb://todosuser:hjk786dfg@ds131151.mlab.com:31151/todos'
}

mongoose.connect(port.mlab, {useNewUrlParser: true})
// mongoose.connect(port.local, {useNewUrlParser: true})

module.exports = {
    mongoose
}
