require('module-alias/register')
require('./pathAlias')
const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const compression = require('compression')
const cors = require('cors')
const httpStatus = require('http-status')
const config = require('./config/config')
const morgan = require('./config/morgan')
const { authLimiter } = require('./middlewares/rateLimiter')
const routes = require('./routes/v1')
const { errorConverter, errorHandler } = require('./middlewares/error')
const ApiError = require('./utils/ApiError')
const bodyParser = require('body-parser')
const app = express()
const http = require('http')
const httpServer = http.createServer(app)

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}



// enable cors
app.use(cors())
app.options('*', cors())

//this to process larger req body
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
  })
)

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
app.use(xss())
app.use(mongoSanitize())

// gzip compression
app.use(compression());




// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter)
}

// v1 api routes

app.use('/api/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

module.exports.httpServer = httpServer
