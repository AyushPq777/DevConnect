import React from 'react'
import { MapPin, Link, Twitter, Linkedin, Users, BookOpen } from 'lucide-react'

const ProfileCard = ({ user, onEdit, isOwnProfile }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Header */}
            <div className="flex items-start space-x-4 mb-6">
                <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.username}
                    className="h-20 w-20 rounded-full"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {user.username}
                    </h1>
                    {user.bio && (
                        <p className="text-gray-600 mb-3">{user.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {user.location && (
                            <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center space-x-1">
                                <Link className="h-4 w-4" />
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Website
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {isOwnProfile && (
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-gray-900">{user.followers?.length || 0}</div>
                    <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-gray-900">{user.following?.length || 0}</div>
                    <div className="text-xs text-gray-500">Following</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-gray-900">{user.postsCount || 0}</div>
                    <div className="text-xs text-gray-500">Posts</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">0</div>
                    <div className="text-xs text-gray-500">Projects</div>
                </div>
            </div>

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Links */}
            {(user.socialLinks?.twitter || user.socialLinks?.linkedin) && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
                    <div className="flex space-x-4">
                        {user.socialLinks.twitter && (
                            <a
                                href={user.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-400 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="text-sm">Twitter</span>
                            </a>
                        )}
                        {user.socialLinks.linkedin && (
                            <a
                                href={user.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-700 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="text-sm">LinkedIn</span>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileCard