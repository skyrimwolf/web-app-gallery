const sinon = require('sinon')
const fs = require('fs')
const expect = require('chai').expect

const imageController = require('../../controllers/image')
const indexController = require('../../controllers/indexList')
const Logger = require('../../models/logger')

exports.stubGetAllImages = async () => { //stub function to test
    const logStub = sinon.stub(Logger, 'log') //mocks a Logger.log() function so it doesn't write in the log file during testing

    const res = { //prepare res to send
        statusCode: 500,
        images: null,
        status: function(code) {
            this.statusCode = code
            return this
        },
        json: function(data) {
            this.images = data
        }
    }
  
    await imageController.getGetAllImageNames({}, res, () => {}) //call the function
    
    expect(res.statusCode).to.be.equal(200) //expect it succeded
    expect(logStub.calledOnce).to.be.true //log was called

    logStub.restore() //restores original logging function
}

exports.stubUploadImage = async (imageId, resMock) => {
    const logStub = sinon.stub(Logger, 'log') //mocks a Logger.log() function so it doesn't write in the log file during testing
    
    const req = { //req body sent
        file: {
          filename: imageId
        }
    }

    const res = { //prepare res to send
        statusCode: 500,
        message: null,
        imagePath: null,
        status: function(code) {
            this.statusCode = code
            return this
        },
        json: function(data) {
            this.message = data.message
            this.imagePath = data.imagePath
        }
    }

    sinon.stub(indexController, 'addToIndexList') //prevent from adding to index list
    sinon.stub(indexController, 'updateIndexJson') //prevent from updating index.json

    await imageController.postUploadImage(req, res)

    expect(indexController.addToIndexList.calledOnceWith({filename: imageId})).to.be.true //add to index list was called with given imageId
    expect(indexController.updateIndexJson.calledOnce).to.be.true //update indexJson was called once as well
    expect(res.statusCode).to.be.equal(200) //expect it succeded
    expect(res.message).to.be.equal('Image uploaded successfully!') //expect this message
    expect(logStub.calledOnce).to.be.true //called log file

    logStub.restore() //restores original logging function
    sinon.restore()
}

exports.stubDownloadImage = async (imageId, doesImageExist) => {
    const logStub = sinon.stub(Logger, 'log') //mocks a Logger.log() function so it doesn't write in the log file during testing
    
    
    
    logStub.restore() //restores original logging function
}

exports.stubRotateImage = async (imageId) => {
    const logStub = sinon.stub(Logger, 'log') //mocks a Logger.log() function so it doesn't write in the log file during testing
    
    
    
    logStub.restore() //restores original logging function
}

exports.stubRemoveImage = async (imageId, indexList, doesImageExist) => {
    const logStub = sinon.stub(Logger, 'log') //mocks a Logger.log() function so it doesn't write in the log file during testing
    
    const req = { //req body sent
        params: {
          imageId: imageId
        }
    }

    const res = { //prepare res to send
        statusCode: 500,
        message: null,
        status: function(code) {
            this.statusCode = code
            return this
        },
        send: function(data) {
            this.message = data
        }
    }

    sinon.stub(indexController, 'removeFromIndexList') //prevent from really calling this 
    sinon.stub(indexController, 'updateIndexJson') //prevent from updating index.json

    if (doesImageExist) { //if there exists an image, it should resolve
        sinon.stub(fs, 'unlink').resolves()
    }
    else { //if there doesn't exist an image, it should reject
        sinon.stub(fs, 'unlink').rejects()
    }

    await imageController.deleteRemoveImage(req, res, () => {})

    if (doesImageExist) {
        indexList = indexList.filter(item => item.filename !== imageId) //update indexList

        expect(indexController.removeFromIndexList.calledOnceWith({filename: imageId})).to.be.true //add to index list was called with given imageId
        expect(indexController.updateIndexJson.calledOnce).to.be.true //update indexJson was called once as well
        expect(res.statusCode).to.be.equal(200) //expect it succeded
        expect(res.message).to.be.equal('Image uploaded successfully!') //expect this message
    }
    else {
        expect(res.statusCode).to.be.equal(500) //expect it succeded
        expect(res.message).to.be.equal('Internal Server Error!') //expect this message
    }

    expect(logStub.calledOnce).to.be.true

    sinon.restore() //restores all sinon.stub() functions
    logStub.restore() //restores original logging function
}