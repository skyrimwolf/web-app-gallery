const sinon = require('sinon')

const indexController = require('../controllers/indexList')
const testController = require('./controllers/image')
const logger = require('../controllers/logger')
const expect = require('chai').expect

let indexList = []

 describe('Tests for replaying crops', () => {
    let resMock

    /*before(function(done) { //before() function is done before beforeEach()!!! so I will use it to stub the Logger.log() so it doesn't write into an actual log file
        resMock = { //mocking response
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub(),
        }

        done() //signal that function before() is done
    })*/
    
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

    it ('should replay logs successfully', async () => {
        const startTime = new Date('2024-01-30T18:54:57.414Z')
        const endTime = new Date('2024-01-30T18:55:07.181Z')

        const logs = await logger.makeCropLog(startTime, endTime) //5 rows

        let previousTimestamp = null //needed to get time

        for(let i = 0; i < logs.length; i++) {
            const currentTimestamp = new Date(logs[i].timestamp).getTime();
            const delay = previousTimestamp ? currentTimestamp - previousTimestamp : 0 //ternary operator, if prev is null, delay is 0
          
            const functionName = logs[i].message.substring(0, logs[i].message.indexOf('('))

            let imageName = ''
            let doesImageExist = false

            if (functionName !== 'getAllImages') {
                imageName = logs[i].message.substring(logs[i].message.indexOf('Image ') + 6, logs[i].message.length - 1)
                                        .split(' ')[0] //take the first element of the message that was split into an array via whitespaces

                doesImageExist = indexList.some(image => image.filename === imageName) //check if an image is inside of the indexList
            }

            setTimeout(() => {
                console.log(`Running function: ${functionName} after ${delay}ms`);
            }, delay);

            switch (functionName) {
                case 'getAllImages':
                    console.log('get')
                    await testController.stubGetAllImages()
                    break
                case 'postUploadImage':
                    console.log('upload')
                    await testController.stubUploadImage(imageName, resMock)
                    break
                case 'getDownloadImage':
                    console.log('download')
                    await testController.stubDownloadImage(imageName, doesImageExist)
                    break
                case 'postRotateImage':
                    console.log('rotate')
                    break
                case 'deleteRemoveImage':
                    console.log('delete')
                    await testController.stubRemoveImage(imageName, indexList, doesImageExist) //handles both if the exists or not!
                    break
            }

            //expect(2+3).to.equal(4)
            //await testController.stubGetAllImages(resMock)
            /*setTimeout(async () => {
                switch (functionName) {
                    case 'getAllImages':
                        console.log('get')
                        expect(2+3).to.equal(4)
                        await testController.stubGetAllImages(resMock)
                        break
                    case 'postUploadImage':
                        await testController.stubUploadImage(imageName, resMock)
                        break
                    case 'getDownloadImage':
                        console.log('download')
                        break
                    case 'postRotateImage':
                        console.log('rotate')
                        break
                    case 'deleteRemoveImage':
                        console.log('delete')
                        await testController.stubRemoveImage(imageName, resMock, indexList, doesImageExist) //handles both if the exists or not!
                        break
                }
                
                console.log(`${functionName} done after ${delay}ms delay`)
            }, delay) //code inside of setTimeout done after delay*/

            previousTimestamp = currentTimestamp
        }
    })

    /*const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Inside your code
async function runDelayedFunction() {
  switch (functionName) {
    case 'getAllImages':
      await delay(delay);
      await testController.stubGetAllImages(resMock);
      break;
    case 'postUploadImage':
      break;
    case 'postRotateImage':
      break;
    case 'deleteRemoveImage':
      await delay(delay);
      await testController.stubRemoveImage(imageName, resMock, indexList, doesImageExist);
      break;
  }

  console.log(`${functionName} done after ${delay}ms delay`);
}*/

    /*after(function(done) { //after() will be called after every test was finished
        sinon.restore()

        done() //signal that function after() is done
    })*/
 })