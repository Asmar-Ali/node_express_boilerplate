const BaseResponse = require('./BaseResponse')


class InternalServer extends BaseResponse {
   code
   message
  constructor(message, code = 500) {
    super(message, code)
    Object.setPrototypeOf(this, InternalServer.prototype)
  }
  getResponse = () => {
    return {
      code: this.code,
      message: this.message
    }
  }
}

module.exports = InternalServer;