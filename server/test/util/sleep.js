//NOTE: this is put here so i could require it wherever i need it later

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = sleep