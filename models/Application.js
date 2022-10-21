const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const applicationSchema = mongoose.Schema(
  {
    jobId: {
      type: ObjectId,
      ref: 'Job',
      required: true,
    },
    managerId: { type: ObjectId, ref: 'User', required: true },
    resume: String,
    coverLetter: {
      type: String,
      trim: true,
    },
    candidateId: {
      type: ObjectId,
      ref: 'User',
      required: true,
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

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
