import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

const App = () => {
    const [imageList, setImageList] = useState([]) //init state as an empty list
    const [selectedImagePath, setSelectedImagePath] = useState('')
    const [imageFile, setImageFile] = useState()
    const inputFileRef = useRef(null)

    useEffect(() => {
      getImages() //load images at the start opening of the page 
    }, []) //[] means it will be ran only at the first render
    
    //function used to get all images
    const getImages = async () => {
      try {
        const response = await axios.get('/images/get-all') //try to get all images (they are of structure {filename, path})

        setImageList(response.data)
      }
      catch (err) {
        console.error('getImages(): Error fetching images: ', err)
      }
    }

    //function used to handle clicking on the upload button
    const handleUpload = async () => {
      if (imageFile) {
        const formData = new FormData()

        formData.append('image', imageFile) //'image' is a key that server will look for!

        try {
          const result = await axios.post('/images/upload', formData) //sends data as post request to '/images/upload'

          await getImages() //refresh the list 
          //NOTE: another approach is to just push the newly uploaded image to the imageList, but I didn't do it because that way
          //      if we open 2 windows and we upload on each one some images, the first window won't get the images the second one uploaded (and vice versa)

          if (inputFileRef.current) { //get it reset
            inputFileRef.current.value = ''
            setImageFile('')
          }

          console.log('Image uploaded successfully on path: ' + result.data.imagePath)
        }
        catch (err) {
          console.error('handleUpload(): Error uploading an image: ', err)
        }
      }
      else {
        alert('You must first choose an image you wish to upload!')
      }
    }

    //function used to handle clicking on the download button
    const handleDownload = async () => {
      if (selectedImagePath !== '') {
        const selectedImageName = new URL(selectedImagePath).pathname.split('/').pop() //get name of the image

        try {
          const response = await axios.get(`/images/download/${selectedImageName}`, { responseType: 'blob' }) //get response from server async
          const url = window.URL.createObjectURL(new Blob([response.data])) //creates an object from data which was taken from the server
          const aTag = document.createElement('a') //creating a tag, setting it to download type, adding it to document.body and activating it

          aTag.href = url
          aTag.setAttribute('download', selectedImageName)
          document.body.appendChild(aTag)
          aTag.click()
          document.body.removeChild(aTag) //releasing resources after it was done
          window.URL.revokeObjectURL(url)
        }
        catch (err) {
          console.error('handleDownload(): Error downloading file: ', err)
        }
      }
      else {
        alert('You must first pick an image you wish to download!')
      }
    }

    //function used to handle clicking on the rotate button
    const handleRotate = async () => {
      if (selectedImagePath !== '') {
        try {
          const selectedImageName = new URL(selectedImagePath).pathname.split('/').pop() //get name of the image
          
          await axios.post(`/images/rotate/${selectedImageName}`)
  
          alert('Image rotated successfully!')
        }
        catch (err) {
          console.error('handleRotate(): Error rotating file: ', err)
        }
      }
      else {
        alert('You must first pick an image you wish to rotate!')
      }
    }

    //function used to handle clicking on the delete button
    const handleDelete = async () => {
      if (selectedImagePath !== '') {
        try {
          const selectedImageName = new URL(selectedImagePath).pathname.split('/').pop() //get name of the image

          await axios.delete(`/images/remove/${selectedImageName}`)

          await getImages() //refresh the list 
          //NOTE: another approach is to just pop the newly deleted image from the imageList, but I didn't do it because that way
          //if we open 2 windows and we delete on each one some images, the first window won't see the changes made in the second one (and vice versa)

          alert('Image deleted successfully!')

          setSelectedImagePath('') //reset selectedImagePath
        }
        catch (err) {
          console.error('handleDelete(): Error deleting file: ', err)
        }
      }
      else {
        alert('You must first choose an image you wish to delete!')
      }
    }

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
        <input type="file"
               ref={inputFileRef}
               onChange={(event) => {setImageFile(event.target.files[0])}} 
               accept=".jpg">
        </input>
          <button id='upload' onClick={handleUpload}>Upload</button>
          <button id='download' onClick={handleDownload}>Download</button>
          <button id='rotate' onClick={handleRotate}>Rotate</button>
          <button id='delete' onClick={handleDelete}>Delete</button>
        </div>

        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            {imageList.map(image => (
                <div key={image.filename} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type='radio' 
                           id={image.filename} 
                           name='imageGroup'
                           value={image.filename} 
                           onChange={() => setSelectedImagePath(image.path)}/>
                    <label htmlFor={image.filename}>{image.filename}</label>
                </div>
            ))}
        </div>
      </div>
    );
}

export default App
