const loggerUtil = require('../util/logger')

//returns all logs within given time frame
exports.makeCropLog = async (startTime, endTime) => {
    try {
        const logs = await loggerUtil.readLogs() //get logs
        
        return logs.filter((log) => { //filter logs and get only those that are in the given timeframe
            const logTimestamp = new Date(log.timestamp)
    
            return logTimestamp >= startTime && logTimestamp <= endTime
        })
        .map(({ timestamp, message }) => ({ //get them into format {time: '..', functionName: '..'}
            time: new Date(timestamp).getTime(),
            functionName: message.substring(0, message.indexOf('(')),
        }))
    }
    catch (err) {
        console.error('makeCropLog(): Error making a crop of logs: ', err)

        return [{}]
    }
}

//concats crops and sends them ready for use (cases of overlapping logs, as well as sending them out of order, were considered and dealt with)
exports.concatCrops = (crops) => {
    let sortedStartTimes = [...new Set(crops.map(row => row[0].time))].sort((a, b) => a - b) //it will first create a set of (unique) times of start crops, and then sort them
    let cropArray = crops.flatMap(row => row)
                            .sort((a, b) => a.time - b.time) //sorting handles case where crop1 is after crop2, even if its chosen before crop2! -> crop1.startTime > crop2. endTime

    const jsonObject = cropArray.map(JSON.stringify)
    const uniqueSet = new Set(jsonObject)
    
    cropArray = Array.from(uniqueSet).map(JSON.parse) //get unique crops (case when they overlap!!)

    let mergedCrops = []
    let offsetStartTime = cropArray[0].time //if the time of the first one is 1706640897729, that will be it's offset
    let j = 1 //we don't start from 0 because 

    for (let i = 0; i < cropArray.length; i++) { //setting up correct times so we can have one crop from yesterday merged with one from today without having to wait the whole day
        const prevTime = mergedCrops.length > 0? mergedCrops[i-1].time : 0 //get the prev time

        if (cropArray[i].time === sortedStartTimes[j]) { //could've done it with ternary operator, but i found this approach more readable
            mergedCrops.push({
                time: prevTime + 100, //+100 means that we will jump from one crop to another with a 100ms delay
                functionName: cropArray[i].functionName
            })

            j += 1 //move through sortetStartTimes array
        }
        else {
            mergedCrops.push({
                time: prevTime + cropArray[i].time - offsetStartTime,
                functionName: cropArray[i].functionName
            })
        }

        offsetStartTime = cropArray[i].time
    }

    return mergedCrops
}