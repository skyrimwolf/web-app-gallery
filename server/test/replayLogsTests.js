const logReplayer = require('./util/replayLogsUtil').logReplayer
const expect = require('chai').expect
const logger = require('../controllers/logger')

 describe('Tests for replaying crops', () => {
    it ('should replay logs successfully', async function() { //must be function() instead of () => {} because of "this" keyword
        this.timeout(0); //no timeout because replay time will vary based on the crop

        const startTime = new Date('2024-01-30T18:54:57.414Z')
        const endTime = new Date('2024-01-30T18:55:07.181Z')
        const logs = await logger.makeCropLog(startTime, endTime) //6 rows, structure is something like this:   { time: 1706640897414, functionName: 'postUploadImage' }
        const imageList = []

        await logReplayer(imageList, logs, {filename: 'macka.jpg', originalname: 'macka.jpg'}, 2) // imageList, logs, picture with which you want to replay logs, scaling factor
    })

    it ('should successfully replay multiple crops combined', async function() {
        this.timeout(0) //no timeout because replay time will vary based on the crop

        const start1 = new Date('2024-01-30T18:54:57.414Z')
        const end1 = new Date('2024-01-30T18:55:07.181Z')
        const start2 = new Date('2024-02-01T19:05:06.450Z')
        const end2 = new Date('2024-02-01T19:05:20.882Z')

        const crop1 = await logger.makeCropLog(start1, end1)
        const crop2 = await logger.makeCropLog(start2, end2)

        // console.log('FIRST LOG: ')
        // crop1.forEach(el => console.log(el))
        // console.log('SECOND LOG: ')
        // crop2.forEach(el => console.log(el))

        const mergedLogs = logger.concatCrops([crop1, crop2])

        //mergedLogs.forEach(el => console.log(el))

        const imageList = []

        await logReplayer(imageList, mergedLogs, {filename: 'macka.jpg', originalname: 'macka.jpg'}, 2) // imageList, logs, picture with which you want to replay logs, scaling factor

        // console.log('Images: ')

        // imageList.forEach(element => {
        //     console.log(element)  
        // })
    })

    it ('should successfully replay multiple crops combined when we select overlapping replays', async function() {
        this.timeout(0) //no timeout because replay time will vary based on the crop

        const start1 = new Date('2024-02-01T18:16:14.104Z')
        const end1 = new Date('2024-02-01T18:16:32.794Z')
        const start2 = new Date('2024-02-01T18:16:19.791Z') //it's earlier than end1! 
        const end2 = new Date('2024-02-01T18:16:42.792Z')

        const crop1 = await logger.makeCropLog(start1, end1)
        const crop2 = await logger.makeCropLog(start2, end2)

        // console.log('FIRST LOG: ')
        // crop1.forEach(el => console.log(el))
        // console.log('SECOND LOG: ')
        // crop2.forEach(el => console.log(el))

        const mergedLogs = logger.concatCrops([crop1, crop2])
        const imageList = []

        // mergedLogs.forEach(el => console.log(el))

        expect(mergedLogs.length).to.equal(6) //even tho crop1 has 5 rows, and crop2 has 5 as well, they overlap!!!

        await logReplayer(imageList, mergedLogs, {filename: 'macka.jpg', originalname: 'macka.jpg'}, 2) // imageList, logs, picture with which you want to replay logs, scaling factor

        // console.log('Images: ')

        // imageList.forEach(element => {
        //     console.log(element)  
        // })
    })
 })