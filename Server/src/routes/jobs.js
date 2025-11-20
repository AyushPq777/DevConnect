import express from 'express';
import {
    createJob,
    getJobs,
    getJob,
    applyForJob,
    getMyApplications,
    getMyJobs
} from '../controllers/jobController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.get('/my-applications', protect, getMyApplications);
router.get('/my-jobs', protect, getMyJobs);
router.get('/:id', optionalAuth, getJob);
router.post('/', protect, createJob);
router.post('/:id/apply', protect, uploadResume, applyForJob);

export default router;