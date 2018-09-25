const env = process.env.NODE_ENV || 'development'

if (env === 'test' || env === 'development') {
    const config = require('./config.json')
    const currentConfig = config[env]
    
    Object.keys(currentConfig).forEach((current) => {
        process.env[current] = currentConfig[current]
    })
}

// if (env === 'production') {
//     process.env.MONGODB_URI = 'mongodb://todosuser:hjk786dfg@ds131151.mlab.com:31151/todos'
// } else if (env === 'test') {
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/todoAppTest'
// } else {
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/todoApp'
// }