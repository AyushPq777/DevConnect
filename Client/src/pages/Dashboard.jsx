import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MessageCircle, Users, Eye, Heart, Trash2, MoreVertical } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        posts: 0,
        followers: 0,
        following: 0
    })
    const [activeDropdown, setActiveDropdown] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [postsResponse, userResponse] = await Promise.all([
                api.get('/posts?limit=5'),
                api.get(`/users/${user.username}`)
            ])

            setPosts(postsResponse.data.data.posts)
            setStats({
                posts: userResponse.data.data.user.posts || 0,
                followers: userResponse.data.data.user.followerCount || 0,
                following: userResponse.data.data.user.followingCount || 0
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePostDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return
        }

        try {
            await api.delete(`/posts/${postId}`)
            // Remove the post from local state
            setPosts(posts.filter(post => post._id !== postId))
            // Update stats
            setStats(prev => ({
                ...prev,
                posts: prev.posts - 1
            }))
            // Close dropdown
            setActiveDropdown(null)
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('Failed to delete post')
        }
    }

    const toggleDropdown = (postId) => {
        setActiveDropdown(activeDropdown === postId ? null : postId)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null)
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {user.username}! 👋
                </h1>
                <p className="text-gray-600">
                    Here's what's happening in your developer community today.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Stats & Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Posts</span>
                                <span className="font-semibold">{stats.posts}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Followers</span>
                                <span className="font-semibold">{stats.followers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Following</span>
                                <span className="font-semibold">{stats.following}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                to="/posts/create"
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Write a Post</span>
                            </Link>
                            <Link
                                to="/messages"
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>Check Messages</span>
                            </Link>
                            <Link
                                to="/network"
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                <Users className="h-4 w-4" />
                                <span>Find Developers</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column - Recent Posts */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Community Posts</h3>
                        </div>

                        <div className="divide-y">
                            {posts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No posts yet. Be the first to share something!
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors relative">
                                        {/* Professional Delete Button with Dropdown */}
                                        <div className="absolute top-4 right-4">
                                            <div className="relative">
                                                {/* Options Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleDropdown(post._id)
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                    title="Post options"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {activeDropdown === post._id && (
                                                    <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                        {/* Delete Option */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handlePostDelete(post._id)
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span>Delete Post</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Post Title */}
                                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                            {post.title}
                                        </h4>

                                        {/* Post Content */}
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.content}
                                        </p>

                                        {/* Post Stats */}
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

                                            <Link
                                                to={`/posts/${post._id}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Read more
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {posts.length > 0 && (
                            <div className="p-4 border-t text-center">
                                <Link
                                    to="/explore"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View all posts
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard