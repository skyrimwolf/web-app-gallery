const {createLogger, transports, format} = require('winston')
const path = require('path')

const rootDir = require('../util/path')

//logger model
const Logger = createLogger({
    transports:[
        new transports.File({
            filename: path.join(rootDir, 'logs', 'server.log'),
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: path.join(rootDir, 'logs', 'server-error.log'),
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = Logger