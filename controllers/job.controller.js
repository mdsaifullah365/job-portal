const mongoose = require('mongoose');
const {
  createJobService,
  updateJobByIdService,
  findJobByIdService,
} = require('../services/job.service');
const { findUserByIdService } = require('../services/user.service');

module.exports.createJob = async (req, res) => {
  try {
    // get the manager info
    const manager = await findUserByIdService(req.user?.id);
    const { _id, firstName, lastName, imageURL } = manager;

    // add manager info to the job post;
    const jobInfo = req.body;
    jobInfo.manager = {
      id: _id,
      firstName,
      lastName,
      imageURL,
    };

    const job = await createJobService(jobInfo);

    if (!job) {
      return req.status(400).json({
        status: 'fail',
        error: "Couldn't create the job",
      });
    }

    res.status(400).json({
      status: 'success',
      message: 'Successfully created the job',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

module.exports.updateJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await findJobByIdService(id);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found with this id',
      });
    }

    const managerId = job.manager.id.toString();
    const userId = req.user.id;

    if (managerId !== userId) {
      return res.status(403).json({
        status: 'fail',
        error:
          'You are not authorized to update this. You did not posted this job',
      });
    }

    const result = await updateJobByIdService(id, req.body);

    if (!result.modifiedCount) {
      return req.status(400).json({
        status: 'fail',
        error: "Couldn't update the job",
      });
    }

    res.status(400).json({
      status: 'success',
      message: 'Successfully updated the job info',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
