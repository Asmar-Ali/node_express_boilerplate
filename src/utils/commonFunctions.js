const logger = require('../config/logger')
const { DEBUGGER2, DEBUGGER3, DEBUGGER1 } = require('./Constants')

const getToken = (req) => {
  return req.headers.token
}

// Function to Sort the Data by given Property
const sortByProperty = (property) => {
  return function (a, b) {
    let sortStatus = 0,
      aProp = a[property],
      bProp = b[property]
    if (aProp < bProp) {
      sortStatus = -1
    } else if (aProp > bProp) {
      sortStatus = 1
    }
    return sortStatus
  }
}

const debugLog1 = (s, data) => {
  if (DEBUGGER1) {
    if (data != undefined) {
      logger.debug(`${s} ${JSON.stringify(data, null, 2)}`)
    } else {
      logger.debug(s)
    }
  }
}

const debugLog2 = (s, data) => {
  if (DEBUGGER2) {
    if (data != undefined) {
      logger.debug(`${s} ${JSON.stringify(data, null, 2)}`)
    } else {
      logger.debug(s)
    }
  }
}

const debugLog3 = (s, data) => {
  if (DEBUGGER3) {
    if (data != undefined) {
      logger.debug(`${s} ${JSON.stringify(data, null, 2)}`)
    } else {
      logger.debug(s)
    }
  }
}

const debugLogError1 = (s, data) => {
  if (DEBUGGER3) {
    if (data != undefined) {
      logger.error(`${s} ${JSON.stringify(data, null, 2)}`)
    } else {
      logger.error(s)
    }
  }
}

module.exports = {
  getToken,
  sortByProperty,
  debugLog1,
  debugLog2,
  debugLog3,
  debugLogError1,
}
