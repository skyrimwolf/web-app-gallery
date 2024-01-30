const {createLogger, transports, format} = require('winston')
const path = require('path')

const rootDir = require('../util/path')

exports.serverLogger = createLogger({ //added logger function which will be used
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