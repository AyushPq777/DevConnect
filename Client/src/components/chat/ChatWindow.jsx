import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { useSocket } from '../../contexts/SocketContext'

const ChatWindow = ({ chat, messages = [] }) => {
    const [newMessage, setNewMessage] = useState('')
    const { socket } = useSocket()
    const messagesEndRef = useRef(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !socket) return

        socket.emit('send_message', {
            chatId: chat._id,
            content: newMessage.trim(),
            messageType: 'text'
        })

        setNewMessage('')
    }

    const getOtherUser = () => {
        if (chat.isGroupChat) return null
        // This would need to be implemented based on your auth context
        return chat.participants[0] // Simplified for demo
    }

    const getChatName = () => {
        if (chat.isGroupChat) return chat.groupName
        const otherUser = getOtherUser()
        return otherUser?.username || 'Unknown User'
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                            {getChatName().charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{getChatName()}</h3>
                        <p className="text-sm text-gray-500">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${message.sender?._id === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender?._id === 'current-user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-900 border'
                                }`}
                        >
                            {message.sender?._id !== 'current-user' && (
                                <div className="font-semibold text-sm mb-1">
                                    {message.sender?.username}
                                </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p
                                className={`text-xs mt-1 ${message.sender?._id === 'current-user'
                                        ? 'text-blue-100'
                                        : 'text-gray-500'
                                    }`}
                            >
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <div className="flex-1 flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Smile className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <Send className="h-4 w-4" />
                        <span>Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow