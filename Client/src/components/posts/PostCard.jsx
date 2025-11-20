// components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, MessageCircle, Heart, User } from 'lucide-react';

const PostCard = ({ post }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            {/* Header with author info */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    {post.author?.avatar ? (
                        <img
                            src={post.author.avatar}
                            alt={post.author.username}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {post.author?.username || 'Unknown User'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.viewCount || 0}</span>
                        </div>
                    </div>

                    <Link
                        to={`/posts/${post._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;