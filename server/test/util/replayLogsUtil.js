const testController = require('../controllers/image')
const sleep = require('./sleep')

//switching function that executes a certain test function based on functionName
const switcher = async (functionName, image, doesImageExist, imageList) => {
    switch (functionName) {
        case 'getAllImages':
            await testController.stubGetAllImages()
            break
        case 'postUploadImage':
            await testController.stubUploadImage(imageList, image)
            break
        case 'getDownloadImage':
            await testController.stubDownloadImage(image, doesImageExist)                   //handles both if the exists or not!
            break
        case 'postRotateImage':
            await testController.stubRotateImage(image, doesImageExist)                     //handles both if the exists or not!
            break
        case 'deleteRemoveImage':
            await testController.stubRemoveImage(imageList, image, doesImageExist)          //handles both if the exists or not!
            break
    }
}

//function that goes through logs and replays them
exports.logReplayer = async (imageList, logs, image, scaleFactor) => {
    let previousTimestamp = logs[0].time                                                    //needed to get time difference (delay)

    if (typeof scaleFactor !== 'number' && scaleFactor !== 0) {                             //if scaleFactor is undefined or the input format is wrong, set it to 1 (also, division by 0 is not possible!)
        scaleFactor = 1
    }
    
    for(let i = 0; i < logs.length; i++) {
        const delay = (logs[i].time - previousTimestamp) / scaleFactor                      //calculate delay based on the difference between this one and previous one and then divide by scaling factor

        const doesImageExist = imageList.some(currImage => currImage === image)             //should be optimized

        await sleep(delay)                                                                  //wait for delay time with possibility of scaling it

        await switcher(logs[i].functionName, image, doesImageExist, imageList)              //execute the given replayed action

        console.log(`Running function: ${logs[i].functionName} after ${delay}ms`)

        previousTimestamp = logs[i].time                                                    //update previous timestamp so we can get new delay time
    }
}