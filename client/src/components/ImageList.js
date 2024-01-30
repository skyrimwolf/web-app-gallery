import React, {useState, useEffect} from 'react'
import axios from 'axios'

export const ImageList = () => {
    const [imageList, setImageList] = useState([]) //init state as an empty list

    useEffect(() => {
        axios.get('/images/get-all')
                .then(images => setImageList(images.data))
                .catch(err => console.error('Error fetching images: ', err))
    }, []) //[] means it will be ran only at the first render

    return (
        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            {imageList.map(imageName => (
                <div key={imageName} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type='checkbox' id={imageName}/>
                    <label htmlFor={imageName}>{imageName}</label>
                </div>
            ))}
        </div>
    )
}