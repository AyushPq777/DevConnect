import express from 'express';
import {
    getUserChats,
    getOrCreateDirectChat,
    createGroupChat,
    getChatMessages,
    addParticipants
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserChats);
router.post('/direct', protect, getOrCreateDirectChat);
router.post('/group', protect, createGroupChat);
router.get('/:id/messages', protect, getChatMessages);
router.post('/:id/participants', protect, addParticipants);

export default router;