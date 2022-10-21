const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      unique: [true, 'Already have an account with this Email'],
      validate: [validator.isEmail, 'Provide a valid Email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
          }),
        message: 'Password is not strong enough.',
      },
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords don't match!",
      },
    },
    role: {
      type: String,
      enum: {
        values: ['candidate', 'hiring-manager', 'admin'],
        message: "Role can't be {VALUE}",
      },
      default: 'candidate',
    },
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters.'],
      maxLength: [20, 'Name is too large'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters.'],
      maxLength: [20, 'Name is too large'],
    },
    contactNumber: {
      type: String,
      validate: {
        validator: (value) => validator.isMobilePhone(value),
        message: 'Please provide a valid contact number',
      },
    },
    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  const password = this.password;

  const hashedPassword = bcrypt.hashSync(password);

  this.password = hashedPassword;
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash);
  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
