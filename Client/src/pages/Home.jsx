import React from 'react'
import { Link } from 'react-router-dom'
import { Code2, Users, MessageCircle, Rocket, Star, Github } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
    const { isAuthenticated } = useAuth()

    const features = [
        {
            icon: Code2,
            title: 'Code Collaboration',
            description: 'Real-time code editing and collaboration with your team'
        },
        {
            icon: Users,
            title: 'Developer Network',
            description: 'Connect with developers worldwide and build your network'
        },
        {
            icon: MessageCircle,
            title: 'Real-time Chat',
            description: 'Instant messaging and code sharing with fellow developers'
        },
        {
            icon: Rocket,
            title: 'Job Opportunities',
            description: 'Find your next career opportunity in the tech industry'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-full p-4 shadow-lg">
                            <Code2 className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Connect. Code. <span className="text-blue-600">Collaborate.</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join DevConnect - the ultimate social platform for developers to connect,
                        collaborate on projects, share knowledge, and advance their careers.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    to="/login"
                                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-white transition-colors"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to grow as a developer
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            From coding together to career advancement, we've got you covered
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div key={index} className="text-center p-6">
                                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-gray-400">Developers</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">5,000+</div>
                            <div className="text-gray-400">Projects</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">2,000+</div>
                            <div className="text-gray-400">Jobs Posted</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to join the community?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Start connecting with developers today and take your skills to the next level
                    </p>
                    {!isAuthenticated && (
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <Rocket className="h-5 w-5 mr-2" />
                            Start Your Journey
                        </Link>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Home