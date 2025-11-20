import React, { useState } from 'react'
import { Search, Plus, Users, MessageCircle } from 'lucide-react'

const ChatSidebar = ({ chats = [], activeChat, onChatSelect, onNewChat }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredChats = chats.filter(chat => {
        if (chat.isGroupChat) {
            return chat.groupName.toLowerCase().includes(searchTerm.toLowerCase())
        } else {
            const otherUser = chat.participants[0] // Simplified
            return otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase())
        }
    })

    const getChatName = (chat) => {
        if (chat.isGroupChat) return chat.groupName
        const otherUser = chat.participants[0] // Simplified
        return otherUser?.username || 'Unknown User'
    }

    const getLastMessage = (chat) => {
        return chat.lastMessage?.content || 'No messages yet'
    }

    return (
        <div className="w-80 bg-white border-r flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                    <button
                        onClick={onNewChat}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                    <button
                        key={chat._id}
                        onClick={() => onChatSelect(chat)}
                        className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${activeChat?._id === chat._id ? 'bg-blue-50 border-blue-200' : 'border-gray-100'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                {chat.isGroupChat ? (
                                    <Users className="h-6 w-6 text-blue-600" />
                                ) : (
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                        {getChatName(chat)}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {chat.lastMessage &&
                                            new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {getLastMessage(chat)}
                                </p>
                                {chat.isGroupChat && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <Users className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {chat.participants.length} members
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredChats.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No conversations found</p>
                        <p className="text-sm mt-1">
                            {searchTerm ? 'Try a different search' : 'Start a new conversation'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatSidebar