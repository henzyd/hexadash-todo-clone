const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

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
  refreshToken: {
    type: String,
    required: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// userSchema.post("save", function (error, doc, next) {
//   if (error.name === "MongoServerError" && error.code === 11000) {
//     next(new AppError("Username already exists", 400));
//   } else {
//     next(error);
//   }
// });

//? NOTE: if there's an error parameter it will call when there's an error, else it will call when there's no error
// userSchema.post("save", function (doc, next) {
//   console.log(doc.password);
//   console.log(typeof doc);
//   delete doc.password;
//   next();
// });

userSchema.methods.passwordRemove = function () {
  //? NOTE: this is a method is used to remove the password from the response

  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
