import React, {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
    const [imageList, setImageList] = useState([]) //init state as an empty list
    const [selectedImage, setSelectedImage] = useState()

    useEffect(() => {
        axios.get('/images/get-all')
                .then(images => setImageList(images.data))
                .catch(err => console.error('Error fetching images: ', err))
    }, []) //[] means it will be ran only at the first render
    
    const handleDownload = () => {
      axios.get(`/images/download/${selectedImage}`)
            .then(() => {
              //logic
            })
            .catch(err => console.error('Error downloading image: ', err))
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
            {imageList.map(imageName => (
                <div key={imageName} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type='radio' 
                           id={imageName} 
                           name='imageGroup'
                           value={imageName} 
                           onChange={() => setSelectedImage(imageName)}/>
                    <label htmlFor={imageName}>{imageName}</label>
                </div>
            ))}
        </div>
      </div>
    );
}

export default App
