const catchAsync = require("../utils/catchAsync");
const { User } = require("../models/userModel");
const { signRefreshToken, signAccessToken } = require("../utils/jwt");

const signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = User({ username, password });
  user.refreshToken = signRefreshToken(user._id);

  await user.save();

  const accessToken = signAccessToken(user._id);

  res.status(201).json({
    status: "success",
    data: {
      ...user.passwordRemove(),
      accessToken,
    },
  });
});

module.exports = { signup };
