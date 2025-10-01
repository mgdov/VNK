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

    // Cleanup effect to restore scroll when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
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
        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
    };

    const closeNewsPopup = () => {
        setSelectedNews(null);
        setIsPopupOpen(false);
        // Restore body scroll when popup is closed
        document.body.style.overflow = 'unset';
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
            <div className="mt-[40px]">
                <motion.div
                    className="text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold mb-12 flex items-center gap-2">
                        Новости
                    </h2>
                </motion.div>

                {news.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Новостей пока нет</p>
                    </div>
                ) : (
                    <div className="max-w-[1200px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map((item, index) => (
                                <motion.article
                                    key={item.id}
                                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    {/* Изображение */}
                                    <div className="relative h-48 overflow-hidden group">
                                        {(() => {
                                            const imageUrl = getImageUrl(item.avatar);
                                            const possibleImageUrl = imageUrl || item.imageUrl || item.avatar?.src || item.avatar;
                                            const isValidImage =
                                                possibleImageUrl &&
                                                typeof possibleImageUrl === "string" &&
                                                (possibleImageUrl.startsWith("http") ||
                                                    possibleImageUrl.startsWith("blob:") ||
                                                    possibleImageUrl.startsWith("data:") ||
                                                    /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(possibleImageUrl));

                                            return isValidImage && !imageErrors.has(item.id) ? (
                                                <img
                                                    src={possibleImageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={() => handleImageError(item.id)}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                                                    <span className="text-white text-4xl font-bold">
                                                        {item.name ? item.name.charAt(0).toUpperCase() : "N"}
                                                    </span>
                                                </div>
                                            );
                                        })()}

                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                                📅 {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Контент */}
                                    <div className="p-6 flex flex-col flex-1">
                                        {item.name && (
                                            <span className="text-gray-500 text-sm font-medium flex items-center gap-1 mb-2">
                                                👤 Автор: {item.name}
                                            </span>
                                        )}

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                            {truncateContent(item.content)}
                                        </p>

                                        <button
                                            onClick={() => openNewsPopup(item)}
                                            className="mt-auto w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
                                        >
                                            ✍️ Читать далее
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            <AnimatePresence>
                {isPopupOpen && selectedNews && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeNewsPopup} // Закрытие по клику на фон
                    >
                        <motion.div
                            className="bg-white rounded-2xl w-full max-w-3xl md:max-w-5xl max-h-[95vh] overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()} // Чтобы клик по контенту не закрывал
                        >
                            {/* Заголовок попапа */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-indigo-100">
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2 md:gap-3 truncate">
                                    📰 {selectedNews.title}
                                </h2>
                                <button
                                    onClick={closeNewsPopup}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                                >
                                    <X size={20} className="md:text-gray-900 text-gray-700 hover:text-gray-900" />
                                </button>
                            </div>

                            {/* Контент попапа */}
                            <div className="flex flex-col md:flex-row h-[calc(95vh-64px)] overflow-hidden">
                                {/* Изображение */}
                                <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden bg-gray-100">
                                    {(() => {
                                        const imageUrl = getImageUrl(selectedNews.avatar);
                                        const possibleImageUrl = imageUrl || selectedNews.avatar?.src || selectedNews.avatar;
                                        const isValidImage =
                                            possibleImageUrl &&
                                            typeof possibleImageUrl === "string" &&
                                            (possibleImageUrl.startsWith("http") ||
                                                possibleImageUrl.startsWith("blob:") ||
                                                possibleImageUrl.startsWith("data:") ||
                                                /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(possibleImageUrl));

                                        return isValidImage && !imageErrors.has(selectedNews.id) ? (
                                            <img
                                                src={possibleImageUrl}
                                                alt={selectedNews.title}
                                                className="w-full h-full object-cover"
                                                onError={() => handleImageError(selectedNews.id)}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                                                <span className="text-white text-5xl md:text-6xl font-bold">
                                                    {selectedNews.name ? selectedNews.name.charAt(0).toUpperCase() : "N"}
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Текстовая часть */}
                                <div className="w-full md:w-1/2 flex flex-col p-4 md:p-6 overflow-y-auto">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs md:text-sm font-medium">
                                            📅 {formatDate(selectedNews.createdAt)}
                                        </span>
                                        {selectedNews.name && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs md:text-sm font-medium">
                                                👤 {selectedNews.name}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 flex-1 whitespace-pre-wrap">
                                        {selectedNews.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}
