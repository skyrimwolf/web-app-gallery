//function to make sure you get unique name
exports.returnUniqueName = (imageList, name) => {
    const countOccurrences = {}

    for (let i = 0; i < imageList.length; i++) {
        const originalName = imageList[i].originalname

        countOccurrences[originalName] = (countOccurrences[originalName] || 0) + 1  //countOccurrences[originalName] || 0  if its undefined, use 0
    }

    if (countOccurrences[name] && countOccurrences[name] > 0) {                     //if defined and greater than 0
        name = name.replace('.jpg', `_${countOccurrences[name]}.jpg`)               //if there are two cat.jpg files, next one will be cat_2.jpg 
    }                                                                               //because the first one is cat.jpg, and second one is cat_1.jpg
    
    return name
}
