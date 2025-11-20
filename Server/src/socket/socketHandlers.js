import Chat from '../models/Chat.js';

export const setupSocketHandlers = (io) => {
    io.use((socket, next) => {
        // Temporary: Allow all connections for now
        // In production, you'll want proper JWT authentication
        socket.userId = socket.handshake.auth.userId || 'temp-user';
        socket.username = socket.handshake.auth.username || 'Anonymous';
        next();
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.username} (${socket.userId})`);

        // Join user to their personal room (with safety check)
        if (socket.userId) {
            socket.join(socket.userId.toString());
        }

        // Handle joining chat rooms
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.username} joined chat: ${chatId}`);
        });

        // Handle leaving chat rooms
        socket.on('leave_chat', (chatId) => {
            socket.leave(chatId);
            console.log(`User ${socket.username} left chat: ${chatId}`);
        });

        // Handle sending messages
        socket.on('send_message', async (data) => {
            try {
                const { chatId, content, messageType = 'text', codeSnippet, fileUrl } = data;

                const chat = await Chat.findById(chatId);
                if (!chat) {
                    socket.emit('error', { message: 'Chat not found' });
                    return;
                }

                // Check if user is participant (simplified for now)
                if (!socket.userId) {
                    socket.emit('error', { message: 'Not authenticated' });
                    return;
                }

                const newMessage = {
                    sender: socket.userId,
                    content,
                    messageType,
                    codeSnippet,
                    fileUrl,
                    readBy: [socket.userId]
                };

                chat.messages.push(newMessage);
                chat.lastMessage = chat.messages[chat.messages.length - 1]._id;
                await chat.save();

                // Populate message before sending
                const populatedChat = await Chat.findById(chatId)
                    .populate('messages.sender', 'username avatar')
                    .populate('participants', 'username avatar');

                const message = populatedChat.messages[populatedChat.messages.length - 1];

                // Send to all participants in the chat
                io.to(chatId).emit('new_message', {
                    chatId,
                    message
                });

                // Send notification to other participants
                chat.participants.forEach(participant => {
                    if (participant._id.toString() !== socket.userId.toString()) {
                        io.to(participant._id.toString()).emit('message_notification', {
                            chatId,
                            message: {
                                content: content.substring(0, 100),
                                sender: { username: socket.username }
                            }
                        });
                    }
                });

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicators
        socket.on('typing_start', (data) => {
            const { chatId } = data;
            socket.to(chatId).emit('user_typing', {
                userId: socket.userId,
                username: socket.username,
                isTyping: true
            });
        });

        socket.on('typing_stop', (data) => {
            const { chatId } = data;
            socket.to(chatId).emit('user_typing', {
                userId: socket.userId,
                username: socket.username,
                isTyping: false
            });
        });

        // Handle message read receipts
        socket.on('mark_message_read', async (data) => {
            try {
                const { chatId, messageId } = data;

                const chat = await Chat.findById(chatId);
                const message = chat.messages.id(messageId);

                if (message && socket.userId && !message.readBy.includes(socket.userId)) {
                    message.readBy.push(socket.userId);
                    await chat.save();

                    socket.to(chatId).emit('message_read', {
                        messageId,
                        readBy: socket.userId
                    });
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        // Handle online status
        socket.on('user_online', () => {
            if (socket.userId) {
                socket.broadcast.emit('user_status', {
                    userId: socket.userId,
                    status: 'online'
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.username}`);
            if (socket.userId) {
                socket.broadcast.emit('user_status', {
                    userId: socket.userId,
                    status: 'offline'
                });
            }
        });
    });
};