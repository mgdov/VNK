import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (error) setError('')
    }, [error])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const result = await login(formData.username, formData.password)

            if (result.success) {
                // Redirect will happen automatically through AuthProvider
            } else {
                setError(result.message)
            }
        } catch (error) {
            setError('Произошла ошибка при входе в систему')
        } finally {
            setIsSubmitting(false)
        }
    }, [login, formData.username, formData.password])

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    const isFormDisabled = useMemo(() =>
        isSubmitting || isLoading,
        [isSubmitting, isLoading]
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-4">
            <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Заголовок */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">
                        VNK Админ Панель
                    </h1>
                    <p className="text-[#7f8c8d]">
                        Войдите в систему для управления контентом
                    </p>
                </div>

                {/* Форма входа */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Поле логина */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[#1E1E1E] mb-2">
                            Логин
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-[#7f8c8d]" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all duration-200"
                                placeholder="Введите логин"
                                disabled={isFormDisabled}
                            />
                        </div>
                    </div>

                    {/* Поле пароля */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#1E1E1E] mb-2">
                            Пароль
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[#7f8c8d]" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all duration-200"
                                placeholder="Введите пароль"
                                disabled={isFormDisabled}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                                disabled={isFormDisabled}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-[#7f8c8d] hover:text-[#1E1E1E] transition-colors" />
                                ) : (
                                    <Eye className="h-5 w-5 text-[#7f8c8d] hover:text-[#1E1E1E] transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Сообщение об ошибке */}
                    {error && (
                        <motion.div
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Кнопка входа */}
                    <button
                        type="submit"
                        disabled={isFormDisabled}
                        className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 px-4 rounded-xl font-600 text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Вход...
                            </>
                        ) : (
                            'Войти в систему'
                        )}
                    </button>
                </form>

                {/* Подсказка */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-[#7f8c8d] text-center">
                        <strong>Тестовые данные:</strong><br />
                        Логин: <code className="bg-white px-2 py-1 rounded">admin</code><br />
                        Пароль: <code className="bg-white px-2 py-1 rounded">admin123</code>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
