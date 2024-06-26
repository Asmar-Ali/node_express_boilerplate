const { Sequelize } = require('sequelize')
const config = require('../config/config')

const db = config.db

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For self-signed certificates
    },
  },
  logging: false, // Disable logging

})

// sequelize.addHook('beforeValidate', (instance, options) => {
//   if (instance.isNewRecord || instance.changed('created_at')) {
//     instance.created_at = new Date()
//   }
//   if (instance.changed('updated_at')) {
//     instance.updated_at = new Date()
//   }
//   if (!instance.created_by) {
//     instance.created_by = 'system' // Set default created_by value
//   }
//   if (!instance.updated_by) {
//     instance.updated_by = 'system' // Set default updated_by value
//   }
// })

module.exports = sequelize
