import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Code } from 'lucide-react'
import { api } from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext' // ← ADD THIS IMPORT

const CreatePost = () => {
    const navigate = useNavigate()
    const { user } = useAuth() // ← ADD THIS
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        codeSnippets: []
    })
    const [loading, setLoading] = useState(false)

    // ADD THIS: Debug when content changes
    const handleContentChange = (e) => {
        const newContent = e.target.value
        console.log('🔍 Content changed:', {
            newContent: newContent,
            containsUsername: user ? newContent.includes(user.username) : false,
            firstLine: newContent.split('\n')[0]
        })

        setFormData(prev => ({ ...prev, content: newContent }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // ADD THESE DEBUG LOGS
        console.log('🚀 === SUBMITTING POST ===')
        console.log('📝 Current user:', user ? user.username : 'No user')
        console.log('📦 Form data being sent:', {
            title: formData.title,
            content: formData.content,
            contentPreview: formData.content.substring(0, 100),
            tags: formData.tags,
            hasUsernameInContent: user ? formData.content.includes(user.username) : false
        })

        try {
            await api.post('/posts', formData)
            navigate('/dashboard')
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Error creating post')
        } finally {
            setLoading(false)
        }
    }

    const addCodeSnippet = () => {
        setFormData(prev => ({
            ...prev,
            codeSnippets: [...prev.codeSnippets, { language: 'javascript', code: '', description: '' }]
        }))
    }

    const updateCodeSnippet = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            codeSnippets: prev.codeSnippets.map((snippet, i) =>
                i === index ? { ...snippet, [field]: value } : snippet
            )
        }))
    }

    const removeCodeSnippet = (index) => {
        setFormData(prev => ({
            ...prev,
            codeSnippets: prev.codeSnippets.filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Post</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="What's your post about?"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            required
                            rows={12}
                            value={formData.content}
                            onChange={handleContentChange} // ← CHANGED THIS
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                            placeholder="Share your thoughts, code, or experiences..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="javascript, react, nodejs, etc."
                        />
                    </div>

                    {/* Code Snippets */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Code Snippets
                            </label>
                            <button
                                type="button"
                                onClick={addCodeSnippet}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Snippet</span>
                            </button>
                        </div>

                        {formData.codeSnippets.map((snippet, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Code className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Snippet {index + 1}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeCodeSnippet(index)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Language
                                        </label>
                                        <select
                                            value={snippet.language}
                                            onChange={(e) => updateCodeSnippet(index, 'language', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="html">HTML</option>
                                            <option value="css">CSS</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            value={snippet.description}
                                            onChange={(e) => updateCodeSnippet(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="What does this code do?"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Code
                                    </label>
                                    <textarea
                                        value={snippet.code}
                                        onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-vertical"
                                        placeholder="Paste your code here..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost