import React, {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
    const [imageList, setImageList] = useState([]) //init state as an empty list
    const [selectedImagePath, setSelectedImagePath] = useState()

    useEffect(() => {
        axios.get('/images/get-all')
              .then(images => setImageList(images.data)) //structure of data is {filename: '..', path: '..'}
              .catch(err => console.error('Error fetching images: ', err))
    }, []) //[] means it will be ran only at the first render
    
    const handleDownload = async () => {
      if (selectedImagePath) {
        const selectedImageName = new URL(selectedImagePath).pathname.split('/').pop()

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
          console.log('handleDownload(): Error downloading file: ' + err)
        }
      }
    }

    const handleRotate = () => {

    }

    const handleDelete = () => {

    }

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
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
