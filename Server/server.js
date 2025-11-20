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
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
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
    res.json({ message: 'DevConnect API is running!' });
});

// Socket.io setup
setupSocketHandlers(io);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devconnect')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Local'}`);
});