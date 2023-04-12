const mongoose = require("mongoose");
const AppError = require("../utils/appError");

function handleCastingErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldDB(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleJWTError(err) {
  return new AppError("Invalid Token", 401);
}

function handleJWTExpiredError(err) {
  return new AppError("Token has expired", 401);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    console.log("this is message > ", err.message);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //? Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err instanceof mongoose.Error.CastError) {
      error = handleCastingErrorDB(err);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldDB(err);
    }
    if (err instanceof mongoose.Error.ValidationError) {
      error = handleValidationErrorDB(err);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError(err);
    }
    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError(err);
    }
    sendErrorProd(error, res);
  }
};
