class ValidationError extends Error {
	constructor(statusCode, message, isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.stack = 'Error in request body validation'
	}
}

module.exports = ValidationError;
