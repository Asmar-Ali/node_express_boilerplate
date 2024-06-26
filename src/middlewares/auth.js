const passport = require('passport')
// const httpStatus = require('http-status');
const { OAuth2Client } = require('google-auth-library')
const { getToken, debugLog1 } = require('../utils/commonFunctions')
const { tokenTypes } = require('../config/tokens')
const BadRequest = require('../utils/modules/Errors/BadRequest')
const { verifyToken } = require('../services/token.service.js')
const { TokenModel } = require('../models')
// const ApiError = require('../utils/ApiError');

const client = new OAuth2Client('799196653078-ujtnjsbcs98a303vounqf6np4bt0nbl3.apps.googleusercontent.com')

// const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
//   if (err || info || !user) {
//     return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//   }
//   req.user = user;

//   resolve();
// };

const auth = async (req, res, next) => {
  const auth = await passport.authenticate('jwt', { session: false })

  debugLog1('auth info ===> ', auth)
  next()
}

const accessTokenAuth = async (req, res, next) => {
  const token = getToken(req)

  if (!token) {
    return res.json(new BadRequest('Provide a valid token in headers'))
  }

  let tokenData = null
  try {
    if (token.length <= 24) {
      let tokenFromDb = await TokenModel.findOne({ _id: token, is_active: true })
      tokenData = await verifyToken(tokenFromDb.token)
    } else {
      tokenData = await verifyToken(token)
    }
  } catch (error) {
    console.log('error ===> ', error)
    return res.json(new BadRequest('Error in token validation. Provide a valid token.'))
  }

  console.log(tokenData != null, tokenData.type === tokenTypes.ACCESS)
  if (tokenData != null && (tokenData.type === tokenTypes.ACCESS)) {
    req.tokenData = tokenData
    next()
  } else {
    return res.json(new BadRequest("Token type is not 'ACCESS'. Provide a valid token."))
  }
}

const resetPasswordTokenAuth = async (req, res, next) => {
  const token = getToken(req)

  if (!token) {
    return res.json(new BadRequest('Provide a valid token in headers'))
  }

  let tokenData = null
  try {
    let tokenFromDb = await TokenModel.findOne({ _id: token, is_active: true })
    tokenData = await verifyToken(tokenFromDb.token)
  } catch (error) {
    return res.json(new BadRequest('Error in token validation. Provide a valid token.'))
  }

  if (token != null && token.type === tokenTypes.RESET_PASSWORD) {
    req.tokenData = tokenData
    next()
  } else {
    return res.json(new BadRequest("Token type is not 'RESET_PASSWORD'. Provide a valid token."))
  }
}

const verifyEmailTokenAuth = async (req, res, next) => {
  const token = getToken(req)

  if (!token) {
    return res.json(new BadRequest('Provide a valid token in headers'))
  }

  let tokenData = null
  try {
    let tokenFromDb = await TokenModel.findOne({ _id: token, is_active: true })
    tokenData = await verifyToken(tokenFromDb.token)
  } catch (error) {
    return res.json(new BadRequest('Error in token validation. Provide a valid token.'))
  }

  // console.log("tokenData ===> ", tokenData);

  if (tokenData != null && tokenData.type === tokenTypes.VERIFY_EMAIL) {
    req.tokenData = tokenData
    req.verifyingAccount = true
    next()
  } else {
    return res.json(new BadRequest("Token type is not 'VERIFY_EMAIL'. Provide a valid token."))
  }
}

const refreshTokenAuth = async (req, res, next) => {
  const token = getToken(req)

  if (!token) {
    return res.json(new BadRequest('Provide a valid token in headers'))
  }

  let tokenData = null
  try {
    tokenData = await verifyToken(token)
  } catch (error) {
    return res.json(new BadRequest('Error in token validation. Provide a valid token.'))
  }

  if (token != null && token.type === tokenTypes.REFRESH) {
    req.tokenData = tokenData
    next()
  } else {
    return res.json(new BadRequest("Token type is not 'REFRESH'. Provide a valid token."))
  }
}

const googleAuth = async (req, res, next) => {
  return passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/contacts.readonly',
    ],
    accessType: 'offline',
    prompt: 'consent',
    session: true,
  })
}

module.exports = {
  auth,
  googleAuth,
  accessTokenAuth,
  resetPasswordTokenAuth,
  verifyEmailTokenAuth,
  refreshTokenAuth,
}
