//const indexController = require('../controllers/indexList')
const logReplayer = require('./util/replayLogsUtil').logReplayer
const logger = require('../controllers/logger')

//let indexList = []

 describe('Tests for replaying crops', () => {
   /* beforeEach(function(done) { //this will be done before each test!
        indexController.initializeIndexList() //re-init the indexList at the beginning of each test 
            .then(() => {
                indexList = indexController.currIndexList() //get the index list
                done()
            })
            .catch((err) => {
                indexList = []
                console.error('beforeEach(): Error getting index list: ', err)

                done(err)
            })
    })*/

    it ('should replay logs successfully', async function() { //must be function() instead of () => {} because of "this" keyword
        this.timeout(0); //no timeout because replay time will vary based on the crop

        const startTime = new Date('2024-01-30T18:54:57.414Z')
        const endTime = new Date('2024-01-30T18:55:07.181Z')
        const logs = await logger.makeCropLog(startTime, endTime) //6 rows, structure is something like this:   { time: 1706640897414, functionName: 'postUploadImage' }
        const imageList = []

        await logReplayer(imageList, logs, 'macka.jpg', 2) // imageList, logs, picture with which you want to replay logs, scaling factor

        //getting ready for multiplexing names -> { filename: 'macka_1.jpg', originalname: 'macka.jpg' }
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

        mergedLogs.forEach(el => console.log(el))
    })
 })