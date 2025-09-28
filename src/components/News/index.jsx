import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getImageUrl } from "../../utils/fileUpload";

export default function NewsBlock() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());
    const [selectedNews, setSelectedNews] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://68d0487dec1a5ff33826f151.mockapi.io/items");
                if (!response.ok) {
                    throw new Error('Ошибка загрузки новостей');
                }
                const data = await response.json();
                const sortedNews = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNews(sortedNews);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const truncateContent = (content, maxLength = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handleImageError = (itemId) => {
        setImageErrors(prev => new Set([...prev, itemId]));
    };

    const openNewsPopup = (newsItem) => {
        setSelectedNews(newsItem);
        setIsPopupOpen(true);
    };

    const closeNewsPopup = () => {
        setSelectedNews(null);
        setIsPopupOpen(false);
    };

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto mt-6 p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E1E1E]"></div>
                    <p className="mt-2 text-[#1E1E1E]">Загрузка новостей...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[1200px] mx-auto mt-6 p-4">
                <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-6">
                    <p className="text-red-600">Ошибка загрузки новостей: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-[40px]">
            <motion.div
                className="text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-12">Новости</h2>
            </motion.div>

            {news.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-[#7f8c8d] text-lg">Новостей пока нет</p>
                </div>
            ) : (
                <div className="max-w-[1200px] mx-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item, index) => (
                            <motion.article
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                {/* Изображение */}
                                <div className="relative h-48 overflow-hidden">
                                    {(() => {
                                        const imageUrl = getImageUrl(item.avatar);
                                        return imageUrl && !imageErrors.has(item.id) ? (
                                            <img
                                                src={imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                onError={() => handleImageError(item.id)}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                                                <span className="text-white text-4xl font-bold">
                                                    {item.name ? item.name.charAt(0).toUpperCase() : 'N'}
                                                </span>
                                            </div>
                                        );
                                    })()}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-[#1E1E1E] px-3 py-1 rounded-full text-sm font-600">
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Контент */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-3">
                                        {item.name && (
                                            <span className="text-[#7f8c8d] text-sm font-500">
                                                Автор: {item.name}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1E1E1E] mb-3 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-[#5a6c7d] text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                        {truncateContent(item.content)}
                                    </p>

                                    <button
                                        onClick={() => openNewsPopup(item)}
                                        className="mt-auto w-full bg-[#1E1E1E] text-white py-3 px-4 rounded-xl font-600 text-sm hover:bg-[#333333] transition-all duration-300 border border-[#1E1E1E] hover:border-[#333333] shadow-lg hover:shadow-xl"
                                    >
                                        Читать далее
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isPopupOpen && selectedNews && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeNewsPopup}
                    >
                        <motion.div
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Заголовок попапа */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-[#1E1E1E]">Новость</h2>
                                <button
                                    onClick={closeNewsPopup}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                                >
                                    <X size={24} className="text-[#1E1E1E] group-hover:text-[#333333]" />
                                </button>
                            </div>

                            {/* Контент попапа */}
                            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                                {/* Изображение */}
                                {(() => {
                                    const imageUrl = getImageUrl(selectedNews.avatar);
                                    return imageUrl && !imageErrors.has(selectedNews.id) ? (
                                        <div className="relative h-64 md:h-80 overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={selectedNews.title}
                                                className="w-full h-full object-cover"
                                                onError={() => handleImageError(selectedNews.id)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-64 md:h-80 bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                                            <span className="text-white text-6xl font-bold">
                                                {selectedNews.name ? selectedNews.name.charAt(0).toUpperCase() : 'N'}
                                            </span>
                                        </div>
                                    );
                                })()}

                                {/* Информация о новости */}
                                <div className="p-6">
                                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="text-[#7f8c8d] text-sm font-500">
                                                {formatDate(selectedNews.createdAt)}
                                            </span>
                                            {selectedNews.name && (
                                                <span className="text-[#7f8c8d] text-sm font-500">
                                                    Автор: {selectedNews.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h1 className="text-3xl font-bold text-[#1E1E1E] mb-4">
                                        {selectedNews.title}
                                    </h1>

                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-[#5a6c7d] leading-relaxed whitespace-pre-wrap">
                                            {selectedNews.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
