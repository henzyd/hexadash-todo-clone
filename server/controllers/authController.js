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

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.passwordMatch(password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      ...user.passwordRemove(),
      accessToken,
      refreshToken,
    },
  });
});

module.exports = { signup, login };
