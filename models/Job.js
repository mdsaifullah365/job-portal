const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      max: [100, 'Job title should be maximum 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline'],
      validate: {
        validator: (value) => {
          return new Date() < new Date(value);
        },
        message: 'Please provide a future date',
      },
    },
    companyName: {
      type: String,
      required: [true, 'Please provide your company name'],
      trim: true,
    },
    jobType: {
      type: String,
      required: [true, 'Please provide job type'],
      enum: {
        values: ['full-time', 'part-time', 'internship', 'contract'],
        message: "Job type can't be {VALUE}",
      },
    },
    position: {
      type: String,
      required: [true, 'Please provide job position'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Please provide salary'],
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true,
    },
    manager: {
      id: {
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
        required: [true, 'Please provide a last name'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters.'],
        maxLength: [20, 'Name is too large'],
      },
      imageURL: {
        type: String,
        validate: [validator.isURL, 'Please provide a valid url'],
      },
    },
    applications: [
      {
        type: ObjectId,
        ref: 'Application',
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
