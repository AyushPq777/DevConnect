import User from '../models/User.js';
import Post from '../models/Post.js'; // ← ADD THIS IMPORT

// @desc    Get user profile
// @route   GET /api/users/:username
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password')
            .populate('followers.user', 'username avatar')
            .populate('following.user', 'username avatar');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // ✅ ADD THIS: Get actual counts from database
        const postCount = await Post.countDocuments({
            author: user._id
        });

        const followerCount = user.followers ? user.followers.length : 0;
        const followingCount = user.following ? user.following.length : 0;

        // ✅ Create user object with all current information
        const userProfile = {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            skills: user.skills || [],
            website: user.website,
            location: user.location,
            socialLinks: user.socialLinks || {},
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,

            // ✅ Real-time counts
            postCount: postCount,
            followerCount: followerCount,
            followingCount: followingCount,

            // ✅ Followers and following arrays (populated)
            followers: user.followers || [],
            following: user.following || []
        };

        res.json({
            success: true,
            data: { user: userProfile }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
    try {
        const { bio, skills, website, location, socialLinks } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                bio,
                skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
                website,
                location,
                socialLinks: socialLinks ? JSON.parse(socialLinks) : {}
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/:userId/follow
export const toggleFollow = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself'
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isFollowing = currentUser.following.some(
            follow => follow.user.toString() === targetUserId
        );

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(
                follow => follow.user.toString() !== targetUserId
            );
            targetUser.followers = targetUser.followers.filter(
                follower => follower.user.toString() !== currentUserId
            );
        } else {
            // Follow
            currentUser.following.push({ user: targetUserId });
            targetUser.followers.push({ user: currentUserId });
        }

        await currentUser.save();
        await targetUser.save();

        res.json({
            success: true,
            data: {
                isFollowing: !isFollowing,
                followerCount: targetUser.followers.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Search users
// @route   GET /api/users/search
export const searchUsers = async (req, res) => {
    try {
        const { q, skill, page = 1, limit = 10 } = req.query;

        let query = {};

        if (q) {
            query.$or = [
                { username: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } }
            ];
        }

        if (skill) {
            query.skills = { $in: [new RegExp(skill, 'i')] };
        }

        const users = await User.find(query)
            .select('username avatar bio skills followers')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ 'followers': -1, 'createdAt': -1 });

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all users (for Explore page)
// @route   GET /api/users
export const getUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;

        let query = {};

        // ✅ ADDED: Search functionality for Explore page
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const users = await User.find(query)
            .select('username avatar bio skills followers following')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};