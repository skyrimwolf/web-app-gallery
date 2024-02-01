const expect = require('chai').expect

const testController = require('./controllers/image')

describe('Tests for making sure controllers work', () => {
    it ('should return images successfully', async () => {
        await testController.stubGetAllImages()
    })

    it ('should upload image successfully', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        
        await testController.stubUploadImage(dummyImage)
    })

    it ('should download image successfully', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        const isImageInIndexJson = true //doing it like this because index.json is changable

        await testController.stubDownloadImage(dummyImage, isImageInIndexJson)
    })

    it ('should fail downloading image', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        const isImageInIndexJson = false //doing it like this because index.json is changable

        await testController.stubDownloadImage(dummyImage, isImageInIndexJson)
    })

    it ('should rotate image successfully', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        const isImageInIndexJson = true //doing it like this because index.json is changable

        await testController.stubRotateImage(dummyImage, isImageInIndexJson)
    })

    it ('should fail rotating image', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        const isImageInIndexJson = false //doing it like this because index.json is changable

        await testController.stubRotateImage(dummyImage, isImageInIndexJson)
    })

    it ('should delete image successfully', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        const isImageInIndexJson = true //doing it like this because index.json is changable

        await testController.stubRemoveImage(dummyImage, isImageInIndexJson)
    })

    it ('should fail deleting image', async () => {
        const dummyImage = '1706782556758_macka.jpg'
        const isImageInIndexJson = false //doing it like this because index.json is changable

        await testController.stubRemoveImage(dummyImage, isImageInIndexJson)
    })
})