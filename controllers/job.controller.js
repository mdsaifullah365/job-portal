const {
  createJobService,
  updateJobByIdService,
  getJobsService,
  applyJobService,
  getJobApplicationService,
  getJobByIdService,
  pushNewApplicationService,
  getManagerJobsService,
  getManagerJobByIdService,
} = require('../services/job.service');
const { findUserByIdService } = require('../services/user.service');

module.exports.getJobs = async (req, res) => {
  try {
    // Filters
    let filters = { ...req.query };

    const excludeFields = ['sort', 'fields'];
    excludeFields.forEach((field) => delete filters[field]);

    let filtersString = JSON.stringify(filters);

    filtersString = filtersString.replace(
      /\b(gt|gte|lt|lte|ne)\b/g,
      (match) => `$${match}`
    );

    filters = JSON.parse(filtersString);

    // Queries
    let queries = {};

    if (req.query.sort) queries.sort = req.query.sort.split(',').join(' ');

    if (req.query.fields)
      queries.fields = req.query.fields.split(',').join(' ');

    // Get Jobs
    let jobs = await getJobsService(filters, queries);

    if (!jobs) {
      return res.status(400).json({
        status: 'fail',
        error: 'No jobs found',
      });
    }

    // Exclude 'applications' field (since it is a public api)
    jobs.forEach((job) => (job.applications = undefined));

    // Send response
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

module.exports.createJob = async (req, res) => {
  try {
    // Get the manager info
    const manager = await findUserByIdService(req.user?.id);
    const { _id, firstName, lastName, imageURL } = manager;

    // Add manager info to the job post;
    const jobInfo = req.body;
    jobInfo.manager = {
      id: _id,
      firstName,
      lastName,
      imageURL,
    };

    // Save or Create the job
    const job = await createJobService(jobInfo);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: "Couldn't create the job",
      });
    }

    // Send response
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
module.exports.getJobById = async (req, res) => {
  try {
    // Get ID
    const { id } = req.params;

    // Get Job Details
    const job = await getJobByIdService(id);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found with this id',
      });
    }

    // Exclude 'applications' field (since it is a public api)
    const { applications, ...others } = job.toObject();

    // Send response
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
    // Get ID
    const { id } = req.params;

    // Get the job
    const job = await getJobByIdService(id);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found with this id',
      });
    }

    // Get manager ID from the job
    const managerId = job.manager.id.toString();

    // Get user ID from the token
    const userId = req.user.id;

    // Check if both IDs matched
    if (managerId !== userId) {
      return res.status(403).json({
        status: 'fail',
        error:
          'You are not authorized to update this. You did not posted this job',
      });
    }

    // Update the job
    const result = await updateJobByIdService(id, req.body);

    if (!result.modifiedCount) {
      return res.status(400).json({
        status: 'fail',
        error: "Couldn't update the job",
      });
    }

    // Send response
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

module.exports.applyJob = async (req, res) => {
  try {
    // Get job ID from params
    const { id: jobId } = req.params;

    // Get candidateId ID from the user token
    const candidateId = req.user?.id;

    // Find job application using the jobId and candidateId to see if already applied
    const isApplied = await getJobApplicationService({ jobId, candidateId });

    if (isApplied) {
      return res.status(400).json({
        status: 'fail',
        error: 'You have already applied this job',
      });
    }

    // Get the job
    const job = await getJobByIdService(jobId);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found',
      });
    }

    // Check if te deadline is over
    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        status: 'fail',
        error: 'You have missed the deadline',
      });
    }

    // Get the application info from the body
    const applicationInfo = req.body;

    // Add jobId, candidateId and the managerId to the applicationInfo
    applicationInfo.jobId = jobId;
    applicationInfo.candidateId = candidateId;
    applicationInfo.managerId = job?.manager?.id;
    applicationInfo.resume = req.files[0].path;

    // Apply/Save the job
    const application = await applyJobService(applicationInfo);

    if (!application) {
      return res.status(400).json({
        status: 'fail',
        error: 'Failed to apply the job',
      });
    }

    // Push new application to the job
    const result = await pushNewApplicationService(jobId, application);

    if (!result) {
      return res.status(400).json({
        status: 'fail',
        error: 'Failed to apply the job',
      });
    } // should undo all changes if failed;

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

module.exports.getManagerJobs = async (req, res) => {
  try {
    // Get manager Id from the user token
    const managerId = req.user?.id;

    // Get all jobs posted by the manager
    const jobs = await getManagerJobsService(managerId);

    if (!jobs) {
      return res.status(400).json({
        status: 'fail',
        error: 'No jobs found',
      });
    }

    // Exclude 'manager' field
    jobs.forEach((job) => (job.manager = undefined));

    // Send response
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

module.exports.getManagerJobById = async (req, res) => {
  try {
    // Get job ID from the params
    const { id } = req.params;

    // Get the job
    const job = await getManagerJobByIdService(id);

    if (!job) {
      return res.status(400).json({
        status: 'fail',
        error: 'No job found with this id',
      });
    }

    // Get managerId from the job
    const managerId = job.manager.id.toString();

    // Get managerId from the user token
    const userId = req.user.id;

    // Check if both IDs matched
    if (managerId !== userId) {
      return res.status(403).json({
        status: 'fail',
        error:
          'You are not authorized to access this. You did not posted this job',
      });
    }

    // Exclude 'manager' info
    const { manager, ...others } = job.toObject();

    // Send response
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
