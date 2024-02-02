const path = require('path')
const fs = require('fs').promises

const rootDir = require('../util/path')
const logDir = path.join(rootDir, 'logs', 'server.log')

exports.readLogs = async () => {
    try {
        const logs = await fs.readFile(logDir, 'utf-8')

        return logs.split('\n')
                    .filter(Boolean) //filter empty lines, to be sure, because it JSON.parse('') would throw an error!
                    .map((row) => JSON.parse(row))
    }
    catch (err) {
        console.error('readLogs(): Error reading logs: ', err)
    }
}