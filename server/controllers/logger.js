//const {createLogger, transports, format} = require('winston')
const path = require('path')
const fs = require('fs').promises 

const rootDir = require('../util/path')
const logDir = path.join(rootDir, 'logs', 'server.log')
//const logErrorDir = path.join(rootDir, 'logs', 'server-error.log') //in case we need it later

//returns an array of JSON objects (each JSON object contains a row in log file)
const readLogs = async () => {
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

//returns all logs within given time frame
exports.makeCropLog = async (startTime, endTime) => {
    try {
        const logs = await readLogs() //get logs

        return logs.filter((log) => { //filter logs and get only those that are in the given timeframe
            const logTimestamp = new Date(log.timestamp)
    
            return logTimestamp >= startTime && logTimestamp <= endTime
        })
    }
    catch (err) {
        console.error('makeCropLog(): Error making a crop of logs: ', err)
    }
}