const expect = require('chai').expect

const logger = require('../controllers/logger')

describe('Tests for creating crops', () => {
    const startTime = new Date('2024-01-30T17:51:30.584Z')
    const endTime = new Date('2024-01-30T17:51:40.068Z')

    it ('should return a crop of 5 log rows', async () => { //done is used when we have async functions so that we don't accidentally get a false 'pass'
        const crop = await logger.makeCropLog(startTime, endTime)

        expect(crop).to.have.length(5)
    })

    it ('should return empty crop', async () => { //done is used when we have async functions so that we don't accidentally get a false 'pass'
        const crop = await logger.makeCropLog(endTime, startTime)

        expect(crop).to.have.length(0)
    })
 })