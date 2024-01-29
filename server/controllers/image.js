const fs = require('fs').promises
const path = require('path')

const rootDir = require('../util/path')

const imagesFolderPath = path.join(rootDir, 'images')

//controller for getting all of the images from server
exports.getAllImageNames = async (req, res, next) => {
    try {
        const files = await fs.readdir(imagesFolderPath) //get filenames from imagesPath
        
        console.log('List of file names:') //will be deleted later
        files.forEach((file) => console.log(file)) //will be deleted later

        res.status(200) //OK
            .json(files) //return filenames
    } 
    catch(err) {
        console.err('getAllImages(): Error fetching image list:', err)

        res.status(500) //Internal Server Error
            .send('Internal Server Error')
    }
}

//controller for uploading an image to server
exports.uploadImage = (req, res, next) => {
    res.status(200) //OK
        .send('Image uploaded successfully!')
}

//controller for downloading an image from server
exports.downloadImage = async (req, res, next) => {
    const imageId = req.params.imageId
    const imagePath = path.join(rootDir, 'images', imageId)

    try {
        await fs.access(imagePath)

        res.setHeader('Content-Type', 'image/jpg') //we need to inform the client that we're sending jpg file
        res.status(200) //OK
            .sendFile(imagePath, {root: imagesFolderPath})
    }
    catch (err) {
        res.status(404)
            .send('downloadImage(): Image not found')
    }
}

//controller for rotating an image on server
exports.rotateImage = (req, res, next) => {

}

//controller for removing an image from server
exports.removeImage = (req, res, next) => {

}