import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/Admin/LoginPage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Показываем загрузку пока проверяем аутентификацию
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Проверка доступа...</p>
                </div>
            </div>
        );
    }

    // Если не аутентифицирован, показываем страницу входа
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    // Если аутентифицирован, показываем защищенный контент
    return children;
};

export default ProtectedRoute;
