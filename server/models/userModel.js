const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please provide a username"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
    refreshToken: {
      type: String,
      required: false,
      select: false,
    },
    lastLogin: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.passwordRemove = function () {
  //? NOTE: this is a method is used to remove the password from the response

  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.passwordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
