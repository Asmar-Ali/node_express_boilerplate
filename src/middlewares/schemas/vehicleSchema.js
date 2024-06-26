const Joi = require('joi')

// Define Joi schema for the vehicle create request
const createVehicleSchema = Joi.object({
  vehicle_class: Joi.string().valid('economy', 'premium').required(),
  make: Joi.string().required(),
  model: Joi.string().required(),
  battery_percentage: Joi.number().integer().min(0).max(100).allow(null),
  color: Joi.string().required(),
  location: Joi.string().required(),
  status: Joi.string().valid('parked', 'approval_pending', 'charging', 'on_road', 'in_maintenance').required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  registration_number: Joi.string().required(),
  vehicle_pic: Joi.string().allow(null),
  registration_card_pic: Joi.string().allow(null),
  insurance_card_pic: Joi.string().allow(null),
  transmission_type: Joi.string().valid('auto', 'manual').required(),
  vin_id: Joi.string().required(),
  internal_codification: Joi.string().required(),
})

const updateVehicleSchema = Joi.object({
  vehicle_class: Joi.string().valid('economy', 'premium'),
  make: Joi.string(),
  model: Joi.string(),
  battery_percentage: Joi.number().integer().min(0).max(100).allow(null),
  color: Joi.string(),
  location: Joi.string(),
  status: Joi.string().valid('parked', 'approval_pending', 'charging', 'on_road', 'in_maintenance'),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
  registration_number: Joi.string(),
  vehicle_pic: Joi.string().allow(null),
  registration_card_pic: Joi.string().allow(null),
  insurance_card_pic: Joi.string().allow(null),
  transmission_type: Joi.string().valid('auto', 'manual'),
  vin_id: Joi.string(),
  internal_codification: Joi.string(),
})

const getVehicleSchema = Joi.object({
  vehicleId: Joi.string().allow('').empty(),
  registrationNumber: Joi.string().allow('').empty(),
})
  .or('vehicleId', 'registrationNumber')
  .empty({})

const deleteVehicleQuerySchema = Joi.object({
  vehicleId: Joi.string().allow('').empty(),
  registrationNumber: Joi.string().allow('').empty(),
})
  .or('vehicleId', 'registrationNumber')
  .empty({})

const deleteVehicleBodySchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).required().empty(Joi.array().max(0)),
})

module.exports = {
  createVehicleSchema,
  updateVehicleSchema,
  getVehicleSchema,
  deleteVehicleQuerySchema,
  deleteVehicleBodySchema,
}
