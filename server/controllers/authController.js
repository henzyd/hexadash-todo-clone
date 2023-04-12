const catchAsync = require("../utils/catchAsync");
const { User } = require("../models/userModel");

const signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // if (!username || !password) {
  //   return next(new AppError("Please provide username and password", 400));
  // }

  const user = await User.create({ username, password });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports = { signup };
