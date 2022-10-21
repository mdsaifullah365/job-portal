const Application = require('../models/Application');
const Job = require('../models/Job');

module.exports.getJobsService = async (filters, queries) => {
  const { fields, sort } = queries;

  return await Job.find(filters).select(fields).sort(sort);
};

module.exports.createJobService = async (data) => {
  return await Job.create(data);
};

module.exports.getJobByIdService = async (id) => {
  return await Job.findById(id);
};

module.exports.updateJobByIdService = async (id, data) => {
  return await Job.updateOne(
    { _id: id },
    { $set: data },
    { runValidators: true }
  );
};

module.exports.applyJobService = async (data) => {
  return await Application.create(data);
};

module.exports.getJobApplicationService = async (filters) => {
  return await Application.findOne(filters);
};

module.exports.pushNewApplicationService = async (id, application) => {
  return await Job.updateOne(
    { _id: id },
    { $push: { applications: application } }
  );
};

module.exports.getManagerJobsService = async (managerId) => {
  return await Job.find({ 'manager.id': managerId });
};

module.exports.getManagerJobByIdService = async (id) => {
  return await Job.findById(id).populate('applications');
};
