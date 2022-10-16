const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, 'Provide a valid Email'],
      trim: true,
      lowercase: true,
      unique: [true, 'Already have an account with this Email'],
      required: [true, 'Email address is required'],
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
        values: ['candidate', 'hr', 'admin'],
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

    appliedJobs: [
      {
        type: ObjectId,
        ref: 'Job',
      },
    ],

    postedJobs: [
      {
        type: ObjectId,
        ref: 'Job',
      },
    ],
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

const User = mongoose.model('User', userSchema);

module.exports = User;
