const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')

const rootDir = require('../util/path')

const imagesFolderPath = path.join(rootDir, 'images')

//NOTE: convention I'll follow for naming controllers for routes will be: HTTP method + controllerName -> POST method + uploadImage -> postUploadImage

//controller for getting all of the images from server
exports.getGetAllImageNames = async (req, res, next) => {
    try {
        const files = await fs.readdir(imagesFolderPath) //get filenames from imagesPath
        
        console.log('List of file names:') //will be deleted later
        files.forEach((file) => console.log(file)) //will be deleted later

        const filesWithPath = files.map((file) => { //create {filename, path} array of objects
            const currImagePath = path.join(imagesFolderPath, file);
            return { filename: file, path: currImagePath };
        });

        res.status(200) //OK
            .json(filesWithPath) //return filenames
    } 
    catch(err) {
        console.err('getAllImages(): Error fetching image list:', err)

        res.status(500) //Internal Server Error
            .send('Internal Server Error!')
    }
}

//controller for uploading an image to server
exports.postUploadImage = (req, res, next) => {
    const destPath = path.join(rootDir, 'images', req.file.filename)

    res.status(200) //OK
        .json({message: 'Image uploaded successfully!', imagePath: destPath})
}

//controller for downloading an image from server
exports.getDownloadImage = async (req, res, next) => {
    const imageId = req.params.imageId
    const imagePath = path.join(rootDir, 'images', imageId)

    try {
        await fs.access(imagePath)

        res.setHeader('Content-Type', 'image/jpg') //we need to inform the client that we're sending jpg file
        res.status(200) //OK
            .sendFile(imagePath)
    }
    catch (err) {
        res.status(404) //Not Found
            .send('downloadImage(): Image not found!')
    }
}

//controller for rotating an image on server
exports.postRotateImage = async (req, res, next) => {
    const imageId = req.params.imageId
    const imagePath = path.join(imagesFolderPath, imageId)

    try {
        const targetImageBuffer = await fs.readFile(imagePath) //read from buffer
        const rotatedImageBuffer = await sharp(targetImageBuffer).rotate(90).toBuffer() //rotates image and puts it to buffer using sharp module

        await fs.writeFile(imagePath, rotatedImageBuffer) //overwrite the image with rotated one

        res.status(200) //OK
            .send('Image rotated succesfully!')
    }
    catch (err) {
        console.err('rotateImage(): Error rotating an image:', err)

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

        res.status(200) //OK
            .send('Image removed successfully!')
    }
    catch (err) {
        console.err('rotateImage(): Error rotating an image:', err)

        res.status(500) //Internal Server Error
            .send('Internal Server Error!')
    }
}