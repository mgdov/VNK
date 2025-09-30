import { useAuth } from '../contexts/AuthContext'
import LoginPage from '../pages/Admin/LoginPage'

// Loading component
const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Проверка доступа...</p>
        </div>
    </div>
)

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()

    // Show loading while checking authentication
    if (isLoading) {
        return <LoadingSpinner />
    }

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginPage />
    }

    // Show protected content if authenticated
    return children
}

export default ProtectedRoute
