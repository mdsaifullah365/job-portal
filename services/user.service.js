const User = require('../models/User');

module.exports.signupService = async (userInfo) => {
  return await User.create(userInfo);
};

module.exports.findUserByIdService = async (id) => {
  return await User.findOne({ _id: id });
};

module.exports.findUserByEmailService = async (email) => {
  return await User.findOne({ email });
};
