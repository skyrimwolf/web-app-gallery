const indexController = require('../controllers/indexList')
const logReplayer = require('./util/replayLogsUtil').logReplayer
const logger = require('../controllers/logger')

let indexList = []

 describe('Tests for replaying crops', () => {
    beforeEach(function(done) { //this will be done before each test!
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
    })

    it ('should replay logs successfully', async function() { //must be function() instead of () => {} because of "this" keyword
        this.timeout(0); //no timeout because replay time will vary based on the crop

        const startTime = new Date('2024-01-30T18:54:57.414Z')
        const endTime = new Date('2024-01-30T18:55:07.181Z')

        const logs = await logger.makeCropLog(startTime, endTime) //5 rows

        await logReplayer(indexList, logs, {}, {}, 2) //the two {} arguments are picture name and if it exists in the index.json (if it doesn't, only uploading will be successful)
    })
 })