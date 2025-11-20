import React, { useState, useEffect, useRef } from 'react'
import { Send, Search, MoreVertical } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import { api } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Messages = () => {
    const { user } = useAuth()
    const { socket, isConnected } = useSocket()
    const [chats, setChats] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        fetchChats()
    }, [])

    useEffect(() => {
        if (activeChat && socket) {
            socket.emit('join_chat', activeChat._id)

            socket.on('new_message', (data) => {
                if (data.chatId === activeChat._id) {
                    setMessages(prev => [...prev, data.message])
                }
            })

            return () => {
                socket.emit('leave_chat', activeChat._id)
                socket.off('new_message')
            }
        }
    }, [activeChat, socket])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchChats = async () => {
        try {
            const response = await api.get('/chats')
            setChats(response.data.data.chats)
            if (response.data.data.chats.length > 0) {
                setActiveChat(response.data.data.chats[0])
                fetchMessages(response.data.data.chats[0]._id)
            }
        } catch (error) {
            console.error('Error fetching chats:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (chatId) => {
        try {
            const response = await api.get(`/chats/${chatId}/messages`)
            setMessages(response.data.data.messages)
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeChat || !socket) return

        const messageData = {
            chatId: activeChat._id,
            content: newMessage.trim(),
            messageType: 'text'
        }

        socket.emit('send_message', messageData)
        setNewMessage('')
    }

    const getOtherUser = (chat) => {
        if (chat.isGroupChat) return null
        return chat.participants.find(p => p._id !== user.id)
    }

    const getChatName = (chat) => {
        if (chat.isGroupChat) return chat.groupName
        const otherUser = getOtherUser(chat)
        return otherUser?.username || 'Unknown User'
    }

    const getChatAvatar = (chat) => {
        if (chat.isGroupChat) return '/group-avatar.png'
        const otherUser = getOtherUser(chat)
        return otherUser?.avatar || '/default-avatar.png'
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border flex h-[600px]">
                {/* Sidebar */}
                <div className="w-80 border-r flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => {
                            const isActive = activeChat?._id === chat._id
                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => {
                                        setActiveChat(chat)
                                        fetchMessages(chat._id)
                                    }}
                                    className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50 border-blue-200' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={getChatAvatar(chat)}
                                            alt={getChatName(chat)}
                                            className="h-12 w-12 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {getChatName(chat)}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {chat.lastMessage && new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {chat.lastMessage?.content || 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {chats.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <p>No conversations yet</p>
                                <p className="text-sm mt-1">Start a conversation with another developer!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={getChatAvatar(activeChat)}
                                        alt={getChatName(activeChat)}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {getChatName(activeChat)}
                                        </h3>
                                        <div className="flex items-center space-x-1">
                                            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            <span className="text-xs text-gray-500">
                                                {isConnected ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender._id === user.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${message.sender._id === user.id
                                                    ? 'text-blue-100'
                                                    : 'text-gray-500'
                                                    }`}
                                            >
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex space-x-4">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || !isConnected}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>Send</span>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-lg font-medium mb-2">No chat selected</h3>
                                <p>Select a conversation or start a new one</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messages