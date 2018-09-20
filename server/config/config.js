const env = process.env.NODE_ENV || 'development'

if (env === 'production') {
    process.env.MONGODB_URI = 'mongodb://todosuser:hjk786dfg@ds131151.mlab.com:31151/todos'
} else if (env === 'test') {
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoAppTest'
} else {
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoApp'
}