import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Code2, MessageCircle, Users, Briefcase, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
    const { user, logout } = useAuth()
    const location = useLocation()

    const navItems = [
        { path: '/dashboard', icon: Code2, label: 'Dashboard' },
        { path: '/explore', icon: Users, label: 'Explore' },
        { path: '/network', icon: Users, label: 'Network' },
        { path: '/messages', icon: MessageCircle, label: 'Messages' },
        { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    ]

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Code2 className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">DevConnect</span>
                    </Link>

                    {/* Navigation */}
                    {user && (
                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="hidden sm:block font-medium">Profile</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors group"
                                >
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                        <LogOut className="h-4 w-4" />
                                    </div>
                                    <span className="hidden sm:block font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors hover:bg-gray-50 rounded-lg"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header