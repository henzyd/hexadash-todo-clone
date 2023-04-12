const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
