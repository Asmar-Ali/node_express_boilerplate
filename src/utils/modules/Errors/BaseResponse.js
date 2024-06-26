class BaseResponse extends Error {
  code
  message

  constructor(message, code = 500) {
    super(message)
    this.message = message
    this.code = code

    Object.setPrototypeOf(this, BaseResponse.prototype)
  }

  getResponse = () => {
    return {
      code: this.code,
      message: this.message
    }
  }
}

module.exports = BaseResponse;
