const express = require('express');
const jobController = require('../../controllers/job.controller');
const authorize = require('../../middleware/authorize');
const validateId = require('../../middleware/validateId');
const verifyToken = require('../../middleware/verifyToken');
const router = express.Router();

router
  .route('/')
  .get(verifyToken, authorize('hiring-manager'), jobController.getJobs);

router
  .route('/:id')
  .get(
    verifyToken,
    authorize('hiring-manager'),
    validateId,
    jobController.getManagerJobById
  );

module.exports = router;
