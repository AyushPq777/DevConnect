import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getGitHubAccessToken, getGitHubUser } from '../utils/githubOAuth.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { username, email, password, bio, skills } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            bio,
            skills: skills ? skills.split(',').map(skill => skill.trim()) : []
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    skills: user.skills
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    skills: user.skills
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    GitHub OAuth
// @route   POST /api/auth/github
export const githubAuth = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Authorization code is required'
            });
        }

        // Get access token from GitHub
        const accessToken = await getGitHubAccessToken(code);

        // Get user data from GitHub
        const githubUser = await getGitHubUser(accessToken);

        // Check if user already exists
        let user = await User.findOne({
            $or: [
                { githubId: githubUser.id },
                { email: githubUser.email }
            ]
        });

        if (user) {
            // Update GitHub data if needed
            if (!user.githubId) {
                user.githubId = githubUser.id;
                user.githubURL = githubUser.html_url;
                if (!user.avatar) user.avatar = githubUser.avatar_url;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                username: githubUser.login,
                email: githubUser.email || `${githubUser.login}@github.com`,
                githubId: githubUser.id,
                githubURL: githubUser.html_url,
                avatar: githubUser.avatar_url,
                bio: githubUser.bio || '',
                isVerified: true
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    skills: user.skills,
                    githubURL: user.githubURL
                },
                token
            }
        });
    } catch (error) {
        console.error('GitHub OAuth error:', error);
        res.status(500).json({
            success: false,
            message: 'GitHub authentication failed'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('followers.user', 'username avatar')
            .populate('following.user', 'username avatar');

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