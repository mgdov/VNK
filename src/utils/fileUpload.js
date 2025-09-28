// Утилита для загрузки файлов на сервер
const UPLOAD_URL = "http://localhost:3001/upload";

// Функция для загрузки файла на сервер
export const uploadFile = async (file) => {
    try {
        // Создаем FormData для загрузки файла
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'image'); // Указываем тип файла

        // Отправляем файл на сервер
        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Ошибка загрузки файла: ${response.status}`);
        }

        const result = await response.json();

        // Возвращаем URL загруженного файла
        return {
            src: result.url || result.fileUrl || result.path,
            title: file.name,
            rawFile: file
        };
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        throw error;
    }
};

// Функция для обработки изображений в данных формы
export const processImageData = async (data) => {
    const processedData = { ...data };

    // Обрабатываем поле avatar (изображение поста)
    if (data.avatar && data.avatar.rawFile) {
        try {
            const uploadedImage = await uploadFile(data.avatar.rawFile);
            processedData.avatar = uploadedImage;
        } catch (error) {
            console.error('Ошибка загрузки изображения поста:', error);
            // Оставляем оригинальные данные в случае ошибки
        }
    }

    return processedData;
};

// Функция для получения URL изображения
export const getImageUrl = (imageData) => {
    if (!imageData) return null;

    // Если это строка (URL)
    if (typeof imageData === 'string') {
        return imageData;
    }

    // Если это объект с src
    if (imageData.src) {
        return imageData.src;
    }

    return null;
};
