import React, { createContext, useState, useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const response = await api.get('/auth/me')
                setUser(response.data.data.user)
            }
        } catch (error) {
            console.log('No valid token found')
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { user, token } = response.data.data

            localStorage.setItem('token', token)
            setUser(user)
            toast.success('Login successful!')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed'
            toast.error(message)
            return { success: false, message }
        }
    }

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData)
            const { user, token } = response.data.data

            localStorage.setItem('token', token)
            setUser(user)
            toast.success('Registration successful!')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            toast.error(message)
            return { success: false, message }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        toast.success('Logged out successfully')
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}