import Chat from '../models/Chat.js';
import User from '../models/User.js';

// @desc    Get user's chats
// @route   GET /api/chats
export const getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user.id
        })
            .populate('participants', 'username avatar')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.json({
            success: true,
            data: { chats }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get or create direct chat
// @route   POST /api/chats/direct
export const getOrCreateDirectChat = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if direct chat already exists
        let chat = await Chat.findOne({
            isGroupChat: false,
            participants: { $all: [req.user.id, userId], $size: 2 }
        }).populate('participants', 'username avatar')
            .populate('messages.sender', 'username avatar');

        if (chat) {
            return res.json({
                success: true,
                data: { chat }
            });
        }

        // Create new direct chat
        chat = await Chat.create({
            participants: [req.user.id, userId],
            isGroupChat: false
        });

        await chat.populate('participants', 'username avatar');

        res.status(201).json({
            success: true,
            data: { chat }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create group chat
// @route   POST /api/chats/group
export const createGroupChat = async (req, res) => {
    try {
        const { name, participants } = req.body;

        if (!name || !participants || participants.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Group name and participants are required'
            });
        }

        // Add current user to participants
        const allParticipants = [...participants, req.user.id];

        const chat = await Chat.create({
            participants: allParticipants,
            isGroupChat: true,
            groupName: name,
            groupAdmin: req.user.id
        });

        await chat.populate('participants', 'username avatar');
        await chat.populate('groupAdmin', 'username avatar');

        res.status(201).json({
            success: true,
            data: { chat }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get chat messages
// @route   GET /api/chats/:id/messages
export const getChatMessages = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        const chat = await Chat.findById(req.params.id)
            .populate('messages.sender', 'username avatar')
            .populate('participants', 'username avatar');

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Check if user is participant
        if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this chat'
            });
        }

        // Paginate messages
        const startIndex = (page - 1) * limit;
        const messages = chat.messages
            .slice(startIndex, startIndex + limit * 1)
            .reverse();

        res.json({
            success: true,
            data: {
                messages,
                chat: {
                    id: chat._id,
                    isGroupChat: chat.isGroupChat,
                    groupName: chat.groupName,
                    participants: chat.participants
                },
                hasMore: startIndex + limit < chat.messages.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add participants to group chat
// @route   POST /api/chats/:id/participants
export const addParticipants = async (req, res) => {
    try {
        const { participants } = req.body;

        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Check if user is group admin
        if (chat.groupAdmin.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Only group admin can add participants'
            });
        }

        // Add new participants
        chat.participants = [...new Set([...chat.participants, ...participants])];
        await chat.save();

        await chat.populate('participants', 'username avatar');

        res.json({
            success: true,
            data: { chat }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};