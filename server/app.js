const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const baseRoute = "/v1";

app.use(express.json());
app.get(`${baseRoute}/`, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the HexaDash-Todo server",
  });
});
app.use(`${baseRoute}/auth`, require("./routes/authRoute"));
app.use(`${baseRoute}/users`, require("./routes/userRoute"));
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
