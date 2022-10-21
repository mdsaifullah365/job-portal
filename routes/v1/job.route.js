const express = require('express');
const jobController = require('../../controllers/job.controller');
const authorize = require('../../middleware/authorize');
const upload = require('../../middleware/upload');
const validateId = require('../../middleware/validateId');
const verifyToken = require('../../middleware/verifyToken');
const router = express.Router();

router
  .route('/jobs')
  .get(jobController.getJobs)
  .post(verifyToken, authorize('hiring-manager'), jobController.createJob);

router
  .route('/jobs/:id')
  .get(validateId, jobController.getJobById)
  .patch(
    verifyToken,
    authorize('hiring-manager'),
    validateId,
    jobController.updateJobById
  );

router
  .route('/jobs/:id/apply')
  .post(
    verifyToken,
    authorize('candidate'),
    upload.array('resume'),
    jobController.applyJob
  );

router
  .route('/manager/jobs')
  .get(verifyToken, authorize('hiring-manager'), jobController.getManagerJobs);

router
  .route('/manager/jobs/:id')
  .get(
    verifyToken,
    authorize('hiring-manager'),
    validateId,
    jobController.getManagerJobById
  );

module.exports = router;
