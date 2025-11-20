import express from 'express';
import {
    getUserProfile,
    updateProfile,
    toggleFollow,
    searchUsers,
    getUsers  // ← ADD THIS
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

// ✅ ADD THIS ROUTE
router.get('/', getUsers);

router.get('/search', searchUsers);
router.get('/:username', getUserProfile);
router.put('/profile', protect, uploadAvatar, updateProfile);
router.post('/:userId/follow', protect, toggleFollow);

export default router;