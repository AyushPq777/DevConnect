import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Eye, Calendar } from 'lucide-react'
import { api } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const PostPage = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`)
            setPost(response.data.data.post)
        } catch (error) {
            console.error('Error fetching post:', error)
            setError('Post not found')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (error || !post) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Posts</span>
            </Link>

            {/* Post Content */}
            <article className="bg-white rounded-lg shadow-sm border p-6">
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <img
                        src={post.author.avatar || '/default-avatar.png'}
                        alt={post.author.username}
                        className="h-10 w-10 rounded-full"
                    />
                    <div>
                        <div className="font-semibold text-gray-900">
                            {post.author.username}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Post Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
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

                {/* Post Content */}
                <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 whitespace-pre-line">
                        {post.content}
                    </p>
                </div>

                {/* Post Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.length || 0} comments</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount || 0} views</span>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default PostPage