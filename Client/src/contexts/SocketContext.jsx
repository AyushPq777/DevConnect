import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem('token')
            const newSocket = io(import.meta.env.VITE_API_URL, {
                auth: {
                    token
                }
            })

            newSocket.on('connect', () => {
                setIsConnected(true)
                console.log('✅ Connected to server')
            })

            newSocket.on('disconnect', () => {
                setIsConnected(false)
                console.log('❌ Disconnected from server')
            })

            newSocket.on('connect_error', (error) => {
                console.error('Connection error:', error)
                toast.error('Failed to connect to chat server')
            })

            newSocket.on('new_message', (data) => {
                // Handle new messages
                console.log('New message:', data)
            })

            setSocket(newSocket)

            return () => {
                newSocket.disconnect()
            }
        }
    }, [user])

    const value = {
        socket,
        isConnected
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}