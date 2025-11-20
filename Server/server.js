import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Routes
import authRoutes from './src/routes/auth.js';
import { default as userRoutes } from './src/routes/users.js';
import postRoutes from './src/routes/posts.js';
import chatRoutes from './src/routes/chats.js';
import jobRoutes from './src/routes/jobs.js';

// Add this after your route imports
console.log('✅ Routes loaded:');
console.log('- authRoutes:', !!authRoutes);
console.log('- userRoutes:', !!userRoutes);
console.log('- postRoutes:', !!postRoutes);

// Socket handlers
import { setupSocketHandlers } from './src/socket/socketHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "https://devconnect-server-w3m5.onrender.com",
            "http://localhost:3000",
            "https://localhost:3000",
            process.env.CLIENT_URL
        ].filter(Boolean); // Remove any undefined values

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

const io = new Server(httpServer, {
    cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/jobs', jobRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'DevConnect API is running!',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Health check route for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'DevConnect API',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Socket.io setup
setupSocketHandlers(io);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devconnect';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 MongoDB: ${MONGODB_URI.includes('localhost') ? 'Local' : 'Cloud'}`);
    console.log(`📎 Server URL: https://devconnect-server-w3m5.onrender.com`);
});
