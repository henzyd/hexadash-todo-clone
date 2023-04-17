const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { User } = require("../models/userModel");

/**
 * Middleware function to check if a token is valid and has not expired
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Returns undefined if the token is valid and the user is authorized, or an error if the token is invalid or has expired
 */
const protectedRoute = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AppError("Authentication required for route access.", 401));
  }

  const token = authorization.split(" ")[1];
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_SECRET
  ); //? NOTE: this is not a synchronous function because we don't want it to block the event loop while it's running

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User does not exist", 401));
  }

  req.currentUser = user;
  next();
});

module.exports = { protectedRoute };
