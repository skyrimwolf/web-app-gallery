const fs = require('fs').promises
const path = require('path')

const rootDir = require('../util/path')

const indexPath = path.join(rootDir, 'index.json')

let indexList = []

exports.initializeIndexList = async () => { //we can import this method to always get the index list (even tho I won't really use it, but it's good to have it)
    try {
        let indexData = await fs.readFile(indexPath, 'utf-8')

        indexList = JSON.parse(indexData) //parse data from index.json to indexList
    }
    catch (err) {
        console.error('initializeIndexList(): Error initializing index list', err)
        indexList = [] //make it so it's empty
    }
}

exports.currIndexList = () => indexList //get the current value of index list

exports.addToIndexList = (newData) => indexList.push(newData) //add new data to index list

exports.updateIndexJson = async () => {
    const indexListJsonString = JSON.stringify(indexList, null, 2)

    try {
        await fs.writeFile(indexPath, indexListJsonString) //update the index.json file
    }
    catch (err) {
        console.error('updateIndexJson(): Error updating index json file!')
    }
}

exports.removeFromIndexList = (fileName) => {
    console.log('List before: ' + indexList)
    indexList = indexList.filter(image => image.filename !== fileName) //removing the element from indexList
    console.log('List after: ' + indexList)
}