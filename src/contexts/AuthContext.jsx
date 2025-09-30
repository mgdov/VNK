import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const AuthContext = createContext()

// Constants
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
}

const STORAGE_KEY = 'admin_auth'
const LOGIN_DELAY = 1000

// Custom hook for auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider')
    }
    return context
}

// Auth utility functions
const getStoredAuth = () => {
    try {
        const savedAuth = localStorage.getItem(STORAGE_KEY)
        return savedAuth ? JSON.parse(savedAuth) : null
    } catch (error) {
        console.error('Ошибка при чтении данных аутентификации:', error)
        localStorage.removeItem(STORAGE_KEY)
        return null
    }
}

const setStoredAuth = (authData) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
    } catch (error) {
        console.error('Ошибка при сохранении данных аутентификации:', error)
    }
}

const clearStoredAuth = () => {
    localStorage.removeItem(STORAGE_KEY)
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            const authData = getStoredAuth()
            if (authData?.isAuthenticated && authData?.user) {
                setIsAuthenticated(true)
                setUser(authData.user)
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [])

    const login = useCallback(async (username, password) => {
        setIsLoading(true)

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, LOGIN_DELAY))

            // Validate credentials
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                const userData = {
                    username,
                    loginTime: new Date().toISOString()
                }

                const authData = {
                    isAuthenticated: true,
                    user: userData
                }

                setStoredAuth(authData)
                setIsAuthenticated(true)
                setUser(userData)

                return { success: true, message: 'Успешный вход в систему' }
            } else {
                return { success: false, message: 'Неверный логин или пароль' }
            }
        } catch (error) {
            console.error('Ошибка при входе:', error)
            return { success: false, message: 'Ошибка сервера при входе' }
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        clearStoredAuth()
        setIsAuthenticated(false)
        setUser(null)
    }, [])

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        isAuthenticated,
        isLoading,
        user,
        login,
        logout
    }), [isAuthenticated, isLoading, user, login, logout])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
