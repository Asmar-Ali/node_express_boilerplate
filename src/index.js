require('module-alias/register')
require('./pathAlias')
const { httpServer } = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')
let server

async function startServer() {
  try {
    server = httpServer.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}\n\n`)
    })
  } catch (error) {
    console.error('Unable to start server', error)
  }
}

;(async () => {
  try {
    // console.log('DB Models: ', Object.keys(sequelize.models))

    // if (config.syncDB) {
    //   await sequelize.authenticate()
    //   console.log('Database connection has been established successfully.')

    //   // await sequelize.sync({force : true})
    //   await sequelize.sync()
    //   console.log('DB sync successfull.')
    // }

    startServer()
    //setup the rabbit MQ
    // setupRabbitMQ()
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error)
  }
})()

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})

module.exports.server = server
