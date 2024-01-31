const expect = require('chai').expect
const sinon = require('sinon')

const imageController = require('../controllers/image')
const logger = require('../controllers/logger')
const Logger = require('../models/logger')

//I will use these times for tests
const startTime = new Date('2024-01-30T17:51:30.584Z')
const endTime = new Date('2024-01-30T17:51:40.068Z')

//log rows that are taken into consideration via these tests are:
/*
{"level":"info","message":"deleteRemoveImage(): Image 1706636402396_1706632397961_tigar.jpg removed successfully!","timestamp":"2024-01-30T17:51:30.584Z"}
{"level":"info","message":"getAllImages(): Successfully got list of image names with paths","timestamp":"2024-01-30T17:51:30.593Z"}
{"level":"info","message":"postUploadImage(): Image 1706637096048_1706632397961_tigar.jpg uploaded successfully!","timestamp":"2024-01-30T17:51:36.071Z"}
{"level":"info","message":"getAllImages(): Successfully got list of image names with paths","timestamp":"2024-01-30T17:51:36.306Z"}
{"level":"info","message":"postRotateImage(): Image 1706637096048_1706632397961_tigar.jpg rotated successfully!","timestamp":"2024-01-30T17:51:40.068Z"}
*/


describe('Tests for creating crops', () => { 
    it ('should return a crop of 5 log rows', async () => { //done is used when we have async functions so that we don't accidentally get a false 'pass'
        const crop = await logger.makeCropLog(startTime, endTime)

        expect(crop).to.have.length(5)
    })

    it ('should return empty crop', async () => { //done is used when we have async functions so that we don't accidentally get a false 'pass'
        const crop = await logger.makeCropLog(endTime, startTime)

        expect(crop).to.have.length(0)
    })
 })

 describe('Tests for replaying crops', () => {
    it ('should replay logs successfully', async () => {
        const logSpy = sinon.spy(Logger, 'log') //mocks a Logger.log() function so it doesn't write in the log file during testing
        
        const dummyReq = [
            {filename: '1706636402396_1706632397961_tigar.jpg'},
            {filename: '1706637096048_1706632397961_tigar.jpg'}
        ]

        const logs = await logger.makeCropLog(startTime, endTime) //5 rows

        let previousTimestamp = null //needed to get time

        logs.forEach((log) => {
            const currentTimestamp = new Date(log.timestamp).getTime();
            const delay = previousTimestamp ? currentTimestamp - previousTimestamp : 0 //ternary operator, if prev is null, delay is 0
            const functionName = log.message.substring(0, log.message.indexOf('('))

            setTimeout(async () => {
                switch (functionName) {
                    case 'getAllImages':
                        const result = await imageController.getGetAllImageNames({}, {}, () => {})
                        expect(result).to.have.property('filename')
                        break
                    case 'postUploadImage':
                        break
                    case 'postRotateImage':
                        break
                    case 'deleteRemoveImage':
                        break
                }
                
            }, delay) //code inside of setTimeout done after delay

            previousTimestamp = currentTimestamp
        })

        logSpy.restore() //restore the original Logger.log() so it runs smoothly after testing
    })
 })