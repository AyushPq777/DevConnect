export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const JOB_TYPES = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
]

export const MESSAGE_TYPES = {
    TEXT: 'text',
    CODE: 'code',
    IMAGE: 'image',
    FILE: 'file'
}