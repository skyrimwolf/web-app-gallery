const testController = require('../controllers/image')
const sleep = require('./sleep')

//switching function that executes a certain test function based on functionName
const switcher = async (functionName, imageName, doesImageExist, indexList) => {
    switch (functionName) {
        case 'getAllImages':
            await testController.stubGetAllImages()
            break
        case 'postUploadImage':
            await testController.stubUploadImage(imageName)
            break
        case 'getDownloadImage':
            await testController.stubDownloadImage(imageName, doesImageExist) //handles both if the exists or not!
            break
        case 'postRotateImage':
            await testController.stubRotateImage(imageName, doesImageExist) //handles both if the exists or not!
            break
        case 'deleteRemoveImage':
            await testController.stubRemoveImage(imageName, indexList, doesImageExist) //handles both if the exists or not!
            break
    }
}

//function that goes through logs and replays them
exports.logReplayer = async (indexList, logs, imageName, doesImageExist, scaleFactor) => {
    let previousTimestamp = null //needed to get time difference (delay)

    for(let i = 0; i < logs.length; i++) {
        const currentTimestamp = new Date(logs[i].timestamp).getTime() //gets time from timestamp on a log
        const functionName = logs[i].message.substring(0, logs[i].message.indexOf('('))

        if (typeof scaleFactor !== 'number' && scaleFactor !== 0) { //if scaleFactor is undefined or the input format is wrong, set it to 1 (also, division by 0 is not possible!)
            scaleFactor = 1
        }

        const delay = previousTimestamp ? (currentTimestamp - previousTimestamp) / scaleFactor : 0 //ternary operator, if prev is null, delay is 0   

        //enter only if the user preset values are undefined (if they are defined, those are overriding values and this shouldn't be executed) and the function isn't called getAllImages
        if (typeof doesImageExist !== 'boolean' && typeof imageName !== 'string' && functionName !== 'getAllImages') {
            imageName = logs[i].message.substring(logs[i].message.indexOf('Image ') + 6, logs[i].message.length - 1)
                                        .split(' ')[0] //take the first element of the message that was split into an array via whitespaces

            doesImageExist = indexList.some(image => image.filename === imageName) //check if an image is inside of the indexList
        }

        await sleep(delay) //wait for delay time with possibility of scaling it

        await switcher(functionName, imageName, doesImageExist, indexList) //execute the given replayed action

        console.log(`Running function: ${functionName} after ${delay}ms`)

        previousTimestamp = currentTimestamp //update previous timestamp so we can get new delay time
    }
}