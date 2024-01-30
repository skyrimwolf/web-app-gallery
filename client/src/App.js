import React, {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
    const [imageList, setImageList] = useState([]) //init state as an empty list
    const [selectedImagePath, setSelectedImagePath] = useState()
    const [imageFile, setImageFile] = useState()

    useEffect(() => {
      const getImages = async () => {
        try {
          const response = await axios.get('/images/get-all') //try to get all images (they are of structure {filename, path})
  
          setImageList(response.data)
        }
        catch (err) {
          console.error('getImages(): Error fetching images: ', err)
        }
      }
      
      getImages()
    }, []) //[] means it will be ran only at the first render
    
    const handleUpload = () => {
      if (imageFile) {
        //logic
      }
      else {
        alert('You must first choose an image you wish to upload!')
      }
    }

    const handleDownload = async () => {
      if (selectedImagePath) {
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
          console.log('handleDownload(): Error downloading file: ', err)
        }
      }
      else {
        alert('You must first pick an image you wish to download!')
      }
    }

    const handleRotate = async () => {
      if (selectedImagePath) {
        try {
          const selectedImageName = new URL(selectedImagePath).pathname.split('/').pop() //get name of the image
          
          await axios.post(`/images/rotate/${selectedImageName}`)
  
          alert('Image rotated successfully!')
        }
        catch (err) {
          console.log('handleRotate(): Error rotating file: ', err)
        }
      }
      else {
        alert('You must first pick an image you wish to rotate!')
      }
    }

    const handleDelete = () => {
      if (selectedImagePath) {
        //logic
      }
      else {
        alert('You must first choose an image you wish to delete!')
      }
    }

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
        <input type="file"
               onChange={(event) => {setImageFile(event.target.files[0])}} 
               accept="image/jpg">
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
