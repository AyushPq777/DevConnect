import React from 'react'
import { Check, CheckCheck } from 'lucide-react'

const Message = ({ message, isOwn }) => {
    const getStatusIcon = () => {
        if (!isOwn) return null

        if (message.readBy && message.readBy.length > 1) {
            return <CheckCheck className="h-3 w-3 text-blue-500" />
        } else if (message.readBy && message.readBy.length === 1) {
            return <Check className="h-3 w-3 text-gray-400" />
        }
        return null
    }

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
            >
                {/* Sender name for group chats */}
                {!isOwn && (
                    <div className="font-semibold text-sm mb-1 text-blue-600">
                        {message.sender?.username}
                    </div>
                )}

                {/* Message content */}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Code snippet */}
                {message.codeSnippet && (
                    <div className="mt-2 p-3 bg-gray-800 rounded-lg font-mono text-sm text-white">
                        <div className="text-gray-400 text-xs mb-1">
                            {message.codeSnippet.language}
                        </div>
                        <pre>{message.codeSnippet.code}</pre>
                    </div>
                )}

                {/* File attachment */}
                {message.fileUrl && (
                    <div className="mt-2">
                        <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm"
                        >
                            📎 View File
                        </a>
                    </div>
                )}

                {/* Timestamp and status */}
                <div
                    className={`flex items-center space-x-1 mt-1 text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}
                >
                    <span>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    {getStatusIcon()}
                </div>
            </div>
        </div>
    )
}

export default Message