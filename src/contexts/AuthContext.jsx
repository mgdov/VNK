import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Данные администратора (в реальном проекте это должно быть на сервере)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Проверяем, есть ли сохраненная сессия при загрузке
    useEffect(() => {
        const checkAuth = () => {
            const savedAuth = localStorage.getItem('admin_auth');
            if (savedAuth) {
                try {
                    const authData = JSON.parse(savedAuth);
                    if (authData.isAuthenticated && authData.user) {
                        setIsAuthenticated(true);
                        setUser(authData.user);
                    }
                } catch (error) {
                    console.error('Ошибка при проверке аутентификации:', error);
                    localStorage.removeItem('admin_auth');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);

        try {
            // Имитируем задержку запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Проверяем учетные данные
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                const userData = {
                    username: username,
                    loginTime: new Date().toISOString()
                };

                // Сохраняем данные в localStorage
                const authData = {
                    isAuthenticated: true,
                    user: userData
                };
                localStorage.setItem('admin_auth', JSON.stringify(authData));

                setIsAuthenticated(true);
                setUser(userData);

                return { success: true, message: 'Успешный вход в систему' };
            } else {
                return { success: false, message: 'Неверный логин или пароль' };
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            return { success: false, message: 'Ошибка сервера при входе' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
