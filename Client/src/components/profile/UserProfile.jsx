import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, MapPin, Calendar, Mail, Github, Twitter, Linkedin, ExternalLink, Users, BookOpen, Folder } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'

const UserProfile = () => {
    const { user: currentUser } = useAuth()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await api.get(`/users/${currentUser.username}`)
            setUserData(response.data.data.user)
        } catch (error) {
            console.error('Error fetching user profile:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border p-8 animate-pulse">
                        <div className="flex space-x-6">
                            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-gray-500">User not found</div>
                </div>
            </div>
        )
    }

    const formatJoinDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-6 md:space-y-0">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {userData.avatar ? (
                                <img
                                    src={userData.avatar}
                                    alt={userData.username}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {userData.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.username}</h1>
                                    <p className="text-gray-600 text-lg mb-4">{userData.bio || 'No bio yet'}</p>
                                </div>
                                <Link
                                    to="/profile/edit"
                                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    <span>Edit Profile</span>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{userData.followerCount || 0}</div>
                                    <div className="text-sm text-gray-600">Followers</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{userData.followingCount || 0}</div>
                                    <div className="text-sm text-gray-600">Following</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{userData.postCount || 0}</div>
                                    <div className="text-sm text-gray-600">Posts</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <Folder className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <div className="text-sm text-gray-600">Projects</div>
                                </div>
                            </div>

                            {/* Contact & Location */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {userData.location && (
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{userData.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {formatJoinDate(userData.createdAt)}</span>
                                </div>
                                {userData.email && (
                                    <div className="flex items-center space-x-1">
                                        <Mail className="h-4 w-4" />
                                        <span>{userData.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Skills & Links */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Skills */}
                        {userData.skills && userData.skills.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {userData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-block px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links - UPDATED WITH BEAUTIFUL UI */}
                        {(userData.socialLinks?.github || userData.socialLinks?.twitter || userData.socialLinks?.linkedin || userData.website) && (
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Me</h3>
                                <div className="space-y-3">
                                    {/* GitHub */}
                                    {userData.socialLinks?.github && (
                                        <a
                                            href={`https://github.com/${userData.socialLinks.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Github className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">GitHub</div>
                                                    <div className="text-xs text-gray-500">Code & Projects</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <span className="text-sm font-medium">Follow</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </a>
                                    )}

                                    {/* Twitter */}
                                    {userData.socialLinks?.twitter && (
                                        <a
                                            href={`https://twitter.com/${userData.socialLinks.twitter}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Twitter className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">Twitter</div>
                                                    <div className="text-xs text-gray-500">Thoughts & Updates</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-600">
                                                <span className="text-sm font-medium">Follow</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </a>
                                    )}

                                    {/* LinkedIn */}
                                    {userData.socialLinks?.linkedin && (
                                        <a
                                            href={`https://www.linkedin.com/in/${userData.socialLinks.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-[#0077B5] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Linkedin className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">LinkedIn</div>
                                                    <div className="text-xs text-gray-500">Professional Network</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-600">
                                                <span className="text-sm font-medium">Connect</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </a>
                                    )}

                                    {/* Website */}
                                    {userData.website && (
                                        <a
                                            href={userData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <ExternalLink className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">Portfolio</div>
                                                    <div className="text-xs text-gray-500">Personal Website</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <span className="text-sm font-medium">Visit</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Posts */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                            {userData.postCount > 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">Posts will appear here</div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium mb-2">No posts yet</p>
                                    <p className="text-sm">Share your first post with the community!</p>
                                    <Link to="/posts/create" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Create Post
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Projects */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
                            <div className="text-center py-12 text-gray-500">
                                <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No projects yet</p>
                                <p className="text-sm">Showcase your work to the community</p>
                                <button className="inline-block mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                    Add Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile