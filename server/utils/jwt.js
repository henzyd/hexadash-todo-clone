const jwt = require("jsonwebtoken");

/**
 * @param {String} id
 * @description Sign an access token
 */
function signAccessToken(id) {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
}

/**
 * @param {String} id
 * @description Sign an refresh token
 */
function signRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
}

module.exports = { signAccessToken, signRefreshToken };
