const expect = require('chai').expect

const testController = require('./controllers/image')

describe('Tests for making sure controllers work', () => {
    it ('should return images successfully', async () => {
        await testController.stubGetAllImages()
    })

    it ('should upload image successfully', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }
        
        const imageList = []

        await testController.stubUploadImage(imageList, dummyImage, imageList)

        expect(imageList.length).to.equal(1) //successfully uploaded
    })

    it ('should download image successfully', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }
        const isImageInIndexJson = true                                                                     //doing it like this because index.json is changable

        await testController.stubDownloadImage(dummyImage, isImageInIndexJson)
    })

    it ('should fail downloading image', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }
        const isImageInIndexJson = false                                                                    //doing it like this because index.json is changable

        await testController.stubDownloadImage(dummyImage, isImageInIndexJson)
    })

    it ('should rotate image successfully', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }
        const isImageInIndexJson = true                                                                     //doing it like this because index.json is changable

        await testController.stubRotateImage(dummyImage, isImageInIndexJson)
    })

    it ('should fail rotating image', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }
        const isImageInIndexJson = false                                                                    //doing it like this because index.json is changable

        await testController.stubRotateImage(dummyImage, isImageInIndexJson)
    })

    it ('should delete image successfully', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }

        let dummyImageList = [dummyImage]
        const isImageInIList = true

        dummyImageList = await testController.stubRemoveImage(dummyImageList, dummyImage, isImageInIList)

        expect(dummyImageList.length).to.equal(0) //successfully deleted
    })

    it ('should fail deleting image', async () => {
        const dummyImage = {                                                                                //here are the same but in reality, if we have more macka.jpgs, filename will look like macka_1.jpg, and originalname will stay the same
            filename: 'macka.jpg',
            originalname: 'macka.jpg'
        }

        let dummyImageList = []
        const isImageInIList = false

        dummyImageList = await testController.stubRemoveImage(dummyImageList, dummyImage, isImageInIList)   //expected to not do anything
    })
})