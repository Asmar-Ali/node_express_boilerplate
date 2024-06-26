const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/config')
const { TokenModel } = require('../models')
const { tokenTypes } = require('../config/tokens')

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = async (payload, secret = config.jwt.secret) => {
	let token = jwt.sign(payload, secret)

	// payload.type !== tokenTypes.VERIFY_EMAIL
	if (payload.type != tokenTypes.ACCESS && payload.type != tokenTypes.REFRESH) {
		let id = await saveToken(token, payload.type)
		return id
	} else {
		return token
	}
}

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<TokenModel>}
 */
const saveToken = async (token, type) => {
	const tokenDoc = await TokenModel.create({
		token,
		type,
	})
	return tokenDoc._id
}

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<TokenModel>}
 */
const verifyToken = async (token, type = 'access') => {
	const payload = jwt.verify(token, config.jwt.secret)

	/*  const tokenDoc = await TokenModel.findOne({ token, type, user: payload.id, blacklisted: false });
	 if (!tokenDoc) {
	   throw new Error('TokenModel not found');
	 } */
	return payload
}

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')
	let payload = {
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		type: tokenTypes.ACCESS,
		iat: moment().unix(),
		exp: accessTokenExpires.unix(),
	}
	// const accessToken = await generateToken(payload)

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days')
	payload = {
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		iat: moment().unix(),
		exp: refreshTokenExpires.unix(),
		type: tokenTypes.REFRESH,
	}
	const refreshToken = await generateToken(payload)

	// await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	}
}

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email, firstName, lastName, userId) => {
	const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes')

	let payload = {
		id: userId,
		firstName: firstName,
		lastName: lastName,
		email: email,
		iat: moment().unix(),
		exp: expires.unix(),
		type: tokenTypes.RESET_PASSWORD,
	}

	const resetPasswordToken = await generateToken(payload)
	// await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
	return resetPasswordToken
}

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
	const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes')
	let payload = {
		id: user._id,
		// firstName: user.first_name,
		// lastName: user.last_name,
		email: user.email,
		iat: moment().unix(),
		exp: expires.unix(),
		type: tokenTypes.VERIFY_EMAIL,
	}
	const verifyEmailToken = await generateToken(payload)
	// await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
	return verifyEmailToken
}

module.exports = {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
	generateResetPasswordToken,
	generateVerifyEmailToken,
}
