const express = require('express')

const imageController = require('../controllers/image')
const middleware = require('../util/multer')

const router = express.Router()

//GET method on path /images/get-all
router.get('/get-all', imageController.getAllImageNames)

//POST method on path /images/upload
router.post('/upload', middleware.multerMiddleware, imageController.uploadImage)

//GET method on path /images/:imageUrl
router.get('/download/:imageUrl', imageController.downloadImage)

//POST method on path /images/rotate/:imageUrl
router.post('/rotate/:imageUrl', imageController.rotateImage)     //maybe PUT instead of POST?

//DELETE method on path /images/remove/:imageUrl
router.delete('/remove/:imageUrl', imageController.removeImage)

module.exports = router