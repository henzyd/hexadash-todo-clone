const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).populate({
    path: "todos",
    select: "title completed createdAt updatedAt",
  });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

module.exports = { getAllUsers };
