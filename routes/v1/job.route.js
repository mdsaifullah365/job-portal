const express = require('express');
const jobController = require('../../controllers/job.controller');
const authorize = require('../../middleware/authorize');
const validateId = require('../../middleware/validateId');
const verifyToken = require('../../middleware/verifyToken');
const router = express.Router();

router
  .route('/')
  .post(verifyToken, authorize('hiring-manager'), jobController.createJob);

router
  .route('/:id')
  .patch(
    verifyToken,
    authorize('hiring-manager'),
    validateId,
    jobController.updateJobById
  );

module.exports = router;
