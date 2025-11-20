import React, { useState } from 'react'
import { Heart, MessageCircle, Eye, Calendar, Share2, Send } from 'lucide-react'
import { formatDate } from '../../utils/helpers'
import { api } from '../../utils/api'

const PostDetail = ({ post }) => {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState(post.comments || [])
    const [isLiked, setIsLiked] = useState(false)

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!comment.trim()) return

        try {
            const response = await api.post(`/posts/${post._id}/comments`, {
                content: comment
            })
            setComments(prev => [...prev, response.data.data.comment])
            setComment('')
        } catch (error) {
            console.error('Error adding comment:', error)
        }
    }

    const handleLike = async () => {
        try {
            await api.post(`/posts/${post._id}/like`)
            setIsLiked(!isLiked)
        } catch (error) {
            console.error('Error liking post:', error)
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
            {/* Post Header */}
            <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src={post.author.avatar || '/default-avatar.png'}
                            alt={post.author.username}
                            className="h-12 w-12 rounded-full"
                        />
                        <div>
                            <div className="font-semibold text-gray-900 text-lg">
                                {post.author.username}
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount || 0} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{comments.length} comments</span>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-6 border-b">
                <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content}
                    </p>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Heart className="h-4 w-4" />
                        <span>Like</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="mb-6">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!comment.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Send className="h-4 w-4" />
                            <span>Comment</span>
                        </button>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-3">
                            <img
                                src={comment.user.avatar || '/default-avatar.png'}
                                alt={comment.user.username}
                                className="h-8 w-8 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="font-semibold text-gray-900">
                                        {comment.user.username}
                                    </div>
                                    <p className="text-gray-700 mt-1">{comment.content}</p>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {formatDate(comment.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {comments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No comments yet. Be the first to comment!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostDetail