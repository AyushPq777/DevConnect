import React from 'react'
import { Heart, MessageCircle, Eye, Calendar, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/helpers'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'

const PostList = ({ posts, onPostClick, onPostDelete }) => {
    const { user } = useAuth()

    const handleDelete = async (postId, e) => {
        e.stopPropagation() // Prevent triggering the post click

        if (!window.confirm('Are you sure you want to delete this post?')) {
            return
        }

        try {
            await api.delete(`/posts/${postId}`)
            // Call the parent component to update the posts list
            if (onPostDelete) {
                onPostDelete(postId)
            }
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('Failed to delete post')
        }
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500">Be the first to create a post!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <div
                    key={post._id}
                    onClick={() => onPostClick && onPostClick(post)}
                    className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer relative"
                >
                    {/* Delete button - only show if user owns the post */}
                    {user && post.author._id === user.id && (
                        <button
                            onClick={(e) => handleDelete(post._id, e)}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete post"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}

                    {/* FIXED: Only show author info once */}
                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={post.author?.avatar || '/default-avatar.png'}
                            alt={post.author?.username || 'User'}
                            className="h-10 w-10 rounded-full"
                        />
                        <div>
                            <div className="font-semibold text-gray-900">
                                {post.author?.username || 'Unknown User'}
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comments?.length || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.viewCount || 0}</span>
                            </div>
                        </div>

                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                            Read more →
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PostList