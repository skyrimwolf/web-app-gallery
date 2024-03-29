const fs = require('fs').promises
const path = require('path')

const rootDir = require('../util/path')
const Logger = require('../models/logger')

const indexPath = path.join(rootDir, 'index.json')

let indexList = []

//NOTE: I was thinking about doing logging here, but, it may mess up crop replay, because this is just a helper tool used
//      even so, i will log errors if they occur, as that may be useful, but I won't log success in this file

exports.initializeIndexList = async () => {                                                     //we can import this method to always get the index list (even tho I won't really use it, but it's good to have it)
    try {
        let indexData = await fs.readFile(indexPath, 'utf-8')

        indexList = JSON.parse(indexData)                                                       //parse data from index.json to indexList
    }
    catch (err) {
        indexList = []                                                                          //make it so it's empty

        Logger.log('error', `initializeIndexList(): Error initializing index list: ${err}`)     //log the given error
    }
}

exports.currIndexList = () => indexList                                                         //get the current value of index list

exports.addToIndexList = (newData) => indexList.push(newData)                                   //add new data to index list

exports.updateIndexJson = async () => {
    const indexListJsonString = JSON.stringify(indexList, null, 2)

    try {
        await fs.writeFile(indexPath, indexListJsonString)                                      //update the index.json file
    }
    catch (err) {
        Logger.log('error', `updateIndexJson(): Error updating index json file: ${err}`)        //log the given error
    }
}

exports.removeFromIndexList = (fileName) => {
    indexList = indexList.filter(image => image.filename !== fileName)                          //removing the element from indexList
}