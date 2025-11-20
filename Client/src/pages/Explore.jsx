import React, { useState, useEffect } from 'react'
import { Search, Filter, Users, BookOpen, Tag, Heart, MessageCircle, Eye } from 'lucide-react'
import { api } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Link } from 'react-router-dom'

const Explore = () => {
    const [activeTab, setActiveTab] = useState('posts')
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchData()
    }, [activeTab, searchQuery])

    const fetchData = async () => {
        setLoading(true)
        try {
            if (activeTab === 'posts') {
                // Use the posts endpoint with search parameter
                const response = await api.get(`/posts?search=${searchQuery}&limit=20`)
                setPosts(response.data.data.posts || [])
            } else {
                // Use the users endpoint - will need to create this in backend
                try {
                    const response = await api.get(`/users?search=${searchQuery}&limit=20`)
                    setUsers(response.data.data.users || [])
                } catch (error) {
                    console.log('Users search endpoint not available yet')
                    setUsers([])
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            // Set empty arrays on error
            if (activeTab === 'posts') {
                setPosts([])
            } else {
                setUsers([])
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        fetchData()
    }

    const tabs = [
        { id: 'posts', name: 'Posts', icon: BookOpen, count: posts.length },
        { id: 'developers', name: 'Developers', icon: Users, count: users.length }
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
                <p className="text-gray-600">Discover posts and developers from the community</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search posts, developers, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-3 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-gray-600">Posts</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                    <div className="text-gray-600">Developers</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.name}</span>
                                <span className="bg-gray-100 text-gray-900 ml-2 py-0.5 px-2 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSpinner />
            ) : activeTab === 'posts' ? (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={post.author?.avatar || '/default-avatar.png'}
                                        alt={post.author?.username || 'User'}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {post.author?.username || 'Unknown User'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
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
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
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
                                <Link
                                    to={`/posts/${post._id}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Read more →
                                </Link>
                            </div>
                        </div>
                    ))}

                    {posts.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchQuery ? 'No posts found' : 'No posts yet'}
                            </h3>
                            <p className="text-gray-500">
                                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create a post!'}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div key={user._id} className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
                            <img
                                src={user.avatar || '/default-avatar.png'}
                                alt={user.username}
                                className="h-16 w-16 rounded-full mx-auto mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {user.username}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {user.bio || 'No bio yet'}
                            </p>

                            {user.skills && user.skills.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-1 mb-4">
                                    {user.skills.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {user.skills.length > 3 && (
                                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                            +{user.skills.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-center space-x-4 text-sm text-gray-500">
                                <span>{user.followers?.length || 0} followers</span>
                                <span>{user.following?.length || 0} following</span>
                            </div>

                            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Follow
                            </button>
                        </div>
                    ))}

                    {users.length === 0 && (
                        <div className="col-span-3 text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchQuery ? 'No developers found' : 'No developers to show yet'}
                            </h3>
                            <p className="text-gray-500">
                                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for more developers'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Explore