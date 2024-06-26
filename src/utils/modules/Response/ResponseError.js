const BadRequest = require('@expresso/modules/Errors/BadRequest')
const BaseResponse = require('@expresso/modules/Errors/BaseResponse')
const Forbidden = require('@expresso/modules/Errors/Forbidden')
const InternalServer = require('@expresso/modules/Errors/InternalServer')
const NotFound = require('@expresso/modules/Errors/NotFound')
const Unauthorized = require('@expresso/modules/Errors/Unauthorized')

const ResponseError = {
  BadRequest,
  BaseResponse,
  Forbidden,
  InternalServer,
  NotFound,
  Unauthorized,
}

export default ResponseError
