import React, { useState } from 'react'
import { Paperclip, Send, X } from 'lucide-react'
import { api } from '../../utils/api'

const JobApplication = ({ job, onClose }) => {
    const [formData, setFormData] = useState({
        coverLetter: '',
        resume: null
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                resume: file
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const submitData = new FormData()
            submitData.append('coverLetter', formData.coverLetter)
            if (formData.resume) {
                submitData.append('resume', formData.resume)
            }

            await api.post(`/jobs/${job._id}/apply`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            alert('Application submitted successfully!')
            onClose()
        } catch (error) {
            console.error('Error submitting application:', error)
            alert('Error submitting application')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Apply for {job.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <p className="text-gray-600 mt-1">at {job.company}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Cover Letter */}
                    <div>
                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Letter *
                        </label>
                        <textarea
                            id="coverLetter"
                            name="coverLetter"
                            required
                            rows={8}
                            value={formData.coverLetter}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                            placeholder="Why are you interested in this position? What makes you a good fit?"
                        />
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resume (optional)
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Paperclip className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    {formData.resume ? formData.resume.name : 'Choose file'}
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {formData.resume && (
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX up to 5MB
                        </p>
                    </div>

                    {/* Application Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Application Preview</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Position:</strong> {job.title}</p>
                            <p><strong>Company:</strong> {job.company}</p>
                            <p><strong>Location:</strong> {job.location}{job.remote && ' (Remote)'}</p>
                            <p><strong>Type:</strong> {job.type.replace('-', ' ')}</p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4" />
                            <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JobApplication