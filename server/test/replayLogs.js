const expect = require('chai').expect

const logger = require('../controllers/logger')

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
        const dummyReq = [
            {filename: '1706636402396_1706632397961_tigar.jpg'},
            {filename: '1706637096048_1706632397961_tigar.jpg'}
        ]
    })
 })