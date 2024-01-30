const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')

const rootDir = require('../util/path')
const indexListUtil = require('./indexList')
const Logger = require('../models/logger')

const imagesFolderPath = path.join(rootDir, 'images')

//NOTE: convention I'll follow for naming controllers for routes will be: HTTP method + controllerName -> POST method + uploadImage -> postUploadImage

//controller for getting all of the images from server
exports.getGetAllImageNames = async (req, res, next) => {
    try {
        const indexList = indexListUtil.currIndexList()

        const filesWithPath = await Promise.all(indexList.map(async (file) => { //since getGetAllImageNames is async, we have to await it
            const currImagePath = path.join(imagesFolderPath, file.filename)

            return { filename: file.filename, path: currImagePath }
        }))

        Logger.log('info', 'getAllImages(): Successfully got list of image names with paths') //log the given action
        
        res.status(200) //OK
            .json(filesWithPath) //return filenames
    } 
    catch(err) {
        Logger.log('error', `getAllImages(): Error fetching image list: ${err}`) //log the given error
        
        res.status(500) //Internal Server Error
            .send('Internal Server Error!')
    }
}

//controller for uploading an image to server
exports.postUploadImage = async (req, res, next) => {
    const destPath = path.join(rootDir, 'images', req.file.filename)

    indexListUtil.addToIndexList({filename: req.file.filename}) //add new object to indexList
    //NOTE: I thought about putting in the imagePath, but since you'll be checking if everything works, for it to work would then require me to have the server running at all times
    //      because the path would have my URL from PC if i send you some images to be loaded upon first run (like pre-loaded data so you can see everything is working nicely)
    //      although, in reality, i'd put in the path and perhaps some other info as well
    //      if I explained it poorly, i'll explain it better on the interview :)

    try {
        indexListUtil.updateIndexJson() //try to update the index json file

        Logger.log('info', `postUploadImage(): Image ${req.file.filename} uploaded successfully!`) //log the given action

        res.status(200) //OK
            .json({message: 'Image uploaded successfully!', imagePath: destPath})
    }
    catch (err) {
        Logger.log('error', `postUploadImage(): Error uploading the image: ${err}`) //log the given error

        res.status(500) //Internal Server Error
            .send('Internal Server Error!')
    }
}

//controller for downloading an image from server
exports.getDownloadImage = async (req, res, next) => { //indexList is not needed here
    const imageId = req.params.imageId
    const imagePath = path.join(rootDir, 'images', imageId)

    try {
        await fs.access(imagePath)

        Logger.log('info', `getDownloadImage(): Image ${imageId} downloaded successfully!`) //log the given action

        res.setHeader('Content-Type', 'image/jpg') //we need to inform the client that we're sending jpg file
            .status(200) //OK
            .sendFile(imagePath)
    }
    catch (err) {
        Logger.log('error', `getDownloadImage(): Image not found: ${err}`) //log the given error

        res.status(404) //Not Found
            .send('getDownloadImage(): Image not found!')
    }
}

//controller for rotating an image on server
exports.postRotateImage = async (req, res, next) => { //indexList is not needed here
    const imageId = req.params.imageId
    const imagePath = path.join(imagesFolderPath, imageId)

    try {
        const targetImageBuffer = await fs.readFile(imagePath) //read from buffer
        const rotatedImageBuffer = await sharp(targetImageBuffer).rotate(90).toBuffer() //rotates image and puts it to buffer using sharp module

        await fs.writeFile(imagePath, rotatedImageBuffer) //overwrite the image with rotated one

        Logger.log('info', `postRotateImage(): Image ${imageId} rotated successfully!`) //log the given action

        res.status(200) //OK
            .send('Image rotated succesfully!')
    }
    catch (err) {
        Logger.log('error', `postRotateImage(): Error rotating an image: ${err}`) //log the given error

        res.status(500) //Internal Server Error
            .send('Internal Server Error!')
    }
}

//controller for removing an image from server
exports.deleteRemoveImage = async (req, res, next) => {
    try {
        const imageId = req.params.imageId
        const imagePath = path.join(imagesFolderPath, imageId)

        await fs.unlink(imagePath) //unlink is used to remove the image from the server

        indexListUtil.removeFromIndexList(imageId) //remove from indexList

        indexListUtil.updateIndexJson() //try to update the index json file

        Logger.log('info', `deleteRemoveImage(): Image ${imageId} removed successfully!`) //log the given action

        res.status(200) //OK
            .send('Image removed successfully!')
    }
    catch (err) {
        Logger.log('error', `deleteRemoveImage(): Error removing an image: ${err}`) //log the given error

        res.status(500) //Internal Server Error
            .send('Internal Server Error!')
    }
}