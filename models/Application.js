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
    candidateId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    managerId: { type: ObjectId, ref: 'User', required: true },
    resume: String,
    coverLetter: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
