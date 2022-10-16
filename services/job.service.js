const Job = require('../models/Job');

module.exports.createJobService = async (data) => {
  return await Job.create(data);
};

module.exports.updateJobByIdService = async (id, data) => {
  return await Job.updateOne(
    { _id: id },
    { $set: data },
    { runValidators: true }
  );
};

module.exports.findJobByIdService = async (id) => {
  return await Job.findById(id);
};
