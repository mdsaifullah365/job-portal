const Application = require('../models/Application');
const Job = require('../models/Job');

module.exports.createJobService = async (data) => {
  return await Job.create(data);
};

module.exports.findJobByIdService = async (id, select) => {
  return await Job.findById(id).select(select);
};

module.exports.findManagerJobByIdService = async (id) => {
  return await Job.findById(id).populate('applications');
};

module.exports.updateJobByIdService = async (id, data) => {
  return await Job.updateOne({ _id: id }, data, { runValidators: true });
};

module.exports.findJobsService = async (filters, queries) => {
  const { select, sort } = queries;

  return await Job.find(filters).select(select).sort(sort);
};

module.exports.applyJobService = async (data) => {
  return await Application.create(data);
};

module.exports.getJobApplicationService = async (filters) => {
  return await Application.findOne(filters);
};
