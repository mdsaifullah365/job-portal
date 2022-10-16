const { isValidObjectId } = require('mongoose');

const validateId = (req, res, next) => {
  const isIdValid = isValidObjectId(req.params.id);
  if (!isIdValid) {
    return res.status(400).json({
      success: false,
      error: 'Id is invalid',
    });
  }

  next();
};

module.exports = validateId;
