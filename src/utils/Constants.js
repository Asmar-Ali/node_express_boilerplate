//frontend paths
module.exports.EXAMPLE_PATH = '/example-path'

//stripe paths
module.exports.STRIPE_REFRESH_URL = process.env.SERVER_HOST + '/payment/account/refresh?idOfAccount='
module.exports.STRIPE_RETURN_URL = process.env.SERVER_HOST + '/payment/account/return?idOfAccount='

//Debugging logging statments check
module.exports.DEBUGGER1 = true
module.exports.DEBUGGER2 = true
module.exports.DEBUGGER3 = false
