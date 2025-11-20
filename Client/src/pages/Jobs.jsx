import React, { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, DollarSign, Clock, Building2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Jobs = () => {
    const { user } = useAuth()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        location: '',
        remote: ''
    })

    useEffect(() => {
        fetchJobs()
    }, [filters])

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.type) params.append('type', filters.type)
            if (filters.location) params.append('location', filters.location)
            if (filters.remote) params.append('remote', filters.remote)

            const response = await api.get(`/jobs?${params.toString()}`)
            setJobs(response.data.data.jobs)
        } catch (error) {
            console.error('Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const jobTypes = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' }
    ]

    const handleApply = async (jobId) => {
        try {
            await api.post(`/jobs/${jobId}/apply`, {
                coverLetter: `I'm interested in this position and believe my skills are a great match.`
            })
            alert('Application submitted successfully!')
        } catch (error) {
            alert('Error applying to job: ' + (error.response?.data?.message || 'Something went wrong'))
        }
    }

    const formatSalary = (salary) => {
        if (!salary.min && !salary.max) return 'Salary not specified'
        if (salary.min && salary.max) {
            return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
        }
        return salary.min ? `From $${salary.min.toLocaleString()}` : `Up to $${salary.max.toLocaleString()}`
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Board</h1>
                <p className="text-gray-600">Find your next career opportunity</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Job title, company, or keywords..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Job Type */}
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Types</option>
                        {jobTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>

                    {/* Location */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Remote */}
                    <select
                        value={filters.remote}
                        onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Work Types</option>
                        <option value="true">Remote</option>
                        <option value="false">On-site</option>
                    </select>
                </div>
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <Briefcase className="h-4 w-4" />
                                                <span>{job.company}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>
                                                    {job.location}
                                                    {job.remote && ' • Remote'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-900 mb-1">
                                        {formatSalary(job.salary)}
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span>{job.type.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {job.description}
                            </p>

                            {job.skills && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Posted {new Date(job.createdAt).toLocaleDateString()} by {job.postedBy?.username}
                                </div>

                                <button
                                    onClick={() => handleApply(job._id)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}

                    {jobs.length === 0 && (
                        <div className="text-center py-12">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-500">
                                {Object.values(filters).some(f => f)
                                    ? 'Try adjusting your filters'
                                    : 'No jobs posted yet'
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Jobs