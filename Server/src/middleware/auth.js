import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        console.log('🔐 Auth middleware - Checking authentication...');
        console.log('🔐 Authorization header:', req.headers.authorization);

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log('🔐 Token found:', token ? 'Yes' : 'No');

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            console.log('🔐 Verifying token...');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('🔐 Token decoded successfully, user ID:', decoded.id);

            req.user = await User.findById(decoded.id).select('-password');
            console.log('🔐 User found in database:', req.user ? 'Yes' : 'No');

            if (req.user) {
                console.log('🔐 User authenticated:', req.user.username);
            } else {
                console.log('❌ User not found in database');
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            console.log('❌ Token verification failed:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        console.log('💥 Auth middleware error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
            } catch (error) {
                // Token is invalid, but we continue without user
                req.user = null;
            }
        }

        next();
    } catch (error) {
        next();
    }
};