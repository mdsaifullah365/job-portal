const {
  createJobService,
  updateJobByIdService,
  findJobByIdService,
  findJobsService,
  applyJobService,
  getJobApplicationService,
  findManagerJobByIdService,
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
      return res.status(400).json({
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

module.exports.getManagerJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await findManagerJobByIdService(id);

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
          'You are not authorized to access this. You did not posted this job',
      });
    }

    const { manager, ...others } = job.toObject();

    res.status(400).json({
      status: 'success',
      message: 'Successfully got the job info',
      data: others,
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
      return res.status(400).json({
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

module.exports.getJobs = async (req, res) => {
  try {
    let filters;
    let queries = {};

    const userId = req.user?.id;

    if (userId) {
      filters = {
        'manager.id': userId,
      };

      queries.select =
        'title description deadline jobType position salary location';
    } else {
      filters = { ...req.query };

      const excludeFields = ['sort'];
      excludeFields.forEach((field) => delete filters[field]);

      let filtersString = JSON.stringify(filters);
      filtersString = filtersString.replace(
        /\b(gt|gte|lt|lte|ne)\b/g,
        (match) => `$${match}`
      );

      filters = JSON.parse(filtersString);

      if (req.query.sort) queries.sort = req.query.sort.split(',').join(' ');

      queries.select = '-applications -manager';
    }

    const jobs = await findJobsService(filters, queries);

    if (!jobs) {
      return res.status(400).json({
        status: 'fail',
        error: 'No jobs found',
      });
    }

    res.status(400).json({
      status: 'success',
      message: 'Successfully got the jobs',
      data: jobs,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

module.exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await findJobByIdService(id, '-applications');

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found with this id',
      });
    }

    res.status(400).json({
      status: 'success',
      message: 'Successfully got the job info',
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

module.exports.applyJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const candidateId = req.user?.id;

    const isApplied = await getJobApplicationService({ jobId, candidateId });

    if (isApplied) {
      return res.status(400).json({
        status: 'fail',
        error: 'You have already applied this job',
      });
    }

    const job = await findJobByIdService(jobId);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found',
      });
    }

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        status: 'fail',
        error: 'You have missed the deadline',
      });
    }

    const applicationInfo = req.body;

    applicationInfo.jobId = jobId;
    applicationInfo.candidateId = candidateId;
    applicationInfo.managerId = job?.manager?.id;
    applicationInfo.resume = req.files[0].path;

    const application = await applyJobService(applicationInfo);

    if (!application) {
      return res.status(400).json({
        status: 'fail',
        error: 'Failed to apply the job',
      });
    }

    const result = await updateJobByIdService(jobId, {
      $push: { applications: application },
    }); // should undo all changes if failed;

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
