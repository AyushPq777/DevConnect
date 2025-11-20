import React from 'react'
import { MapPin, Briefcase, DollarSign, Clock, Building2 } from 'lucide-react'

const JobCard = ({ job, onApply, onViewDetails }) => {
    const formatSalary = (salary) => {
        if (!salary.min && !salary.max) return 'Salary not specified'
        if (salary.min && salary.max) {
            return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
        }
        return salary.min ? `From $${salary.min.toLocaleString()}` : `Up to $${salary.max.toLocaleString()}`
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
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
                        <span className="capitalize">{job.type.replace('-', ' ')}</span>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
                {job.description}
            </p>

            {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                            key={index}
                            className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 4 && (
                        <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                            +{job.skills.length - 4} more
                        </span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => onViewDetails && onViewDetails(job)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onApply && onApply(job._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JobCard