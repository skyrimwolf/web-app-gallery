const fs = require('fs').promises
const path = require('path')

const rootDir = require('../util/path')

//controller for getting all of the images from server
exports.getAllImageNames = async (req, res, next) => {
    try {
        const targetPath = path.join(rootDir, 'images')
        const files = await fs.readdir(targetPath) //get filenames from targetPath
        
        console.log('List of file names:') //will be deleted later
        files.forEach((file) => console.log(file)) //will be deleted later

        res.status(200) //OK
            .json(files) //return filenames
    } 
    catch(err) {
        console.err('getAllImages: Error fetching image list:', err)

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
exports.downloadImage = (req, res, next) => {

}

//controller for rotating an image on server
exports.rotateImage = (req, res, next) => {

}

//controller for removing an image from server
exports.removeImage = (req, res, next) => {

}