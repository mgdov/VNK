// File upload utilities
const UPLOAD_URL = "http://localhost:3001/upload"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

// Validate file before upload
const validateFile = (file) => {
    if (!file) {
        throw new Error('Файл не выбран')
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Размер файла превышает ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Неподдерживаемый тип файла. Разрешены: JPEG, PNG, GIF, WebP, SVG')
    }

    return true
}

// Upload file to server
export const uploadFile = async (file) => {
    try {
        validateFile(file)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'image')

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Ошибка загрузки файла: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        return {
            src: result.url || result.fileUrl || result.path,
            title: file.name,
            rawFile: file
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Превышено время ожидания загрузки файла')
        }
        console.error('Ошибка загрузки файла:', error)
        throw error
    }
}

// Process image data in form
export const processImageData = async (data) => {
    const processedData = { ...data }

    // Support different ImageInput shapes used by react-admin:
    // - avatar: { rawFile, ... }
    // - avatar: [ { rawFile, ... } ]
    try {
        if (Array.isArray(data.avatar) && data.avatar.length > 0 && data.avatar[0]?.rawFile) {
            const uploadedImage = await uploadFile(data.avatar[0].rawFile)
            processedData.avatar = uploadedImage
        } else if (data.avatar?.rawFile) {
            const uploadedImage = await uploadFile(data.avatar.rawFile)
            processedData.avatar = uploadedImage
        }
    } catch (error) {
        console.error('Ошибка загрузки изображения поста:', error)
        // Keep original data on error
    }

    // If upload failed (or upload server unavailable) but we have a rawFile,
    // create a base64 data URL fallback so the frontend can display the image.
    const toDataUrl = (file) => new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } catch (e) {
            reject(e);
        }
    });

    try {
        if (!processedData.avatar || (processedData.avatar && !processedData.avatar.src)) {
            // handle array form
            const raw = Array.isArray(data.avatar) && data.avatar.length > 0 ? data.avatar[0]?.rawFile : data.avatar?.rawFile;
            if (raw) {
                try {
                    const dataUrl = await toDataUrl(raw);
                    processedData.avatar = processedData.avatar && processedData.avatar.title ? { src: dataUrl, title: processedData.avatar.title } : { src: dataUrl, title: raw.name || 'image' };
                } catch (e) {
                    // ignore
                    console.warn('Не удалось создать data URL из файла:', e);
                }
            }
        }
    } catch (e) {
        console.warn('Fallback image processing failed:', e);
    }

    return processedData
}

// Get image URL from various data formats
export const getImageUrl = (imageData) => {
    if (!imageData) return null

    // String URL
    if (typeof imageData === 'string') {
        return imageData
    }

    // Object with src property
    if (imageData?.src) {
        return imageData.src
    }

    // Blob URL
    if (imageData instanceof Blob) {
        return URL.createObjectURL(imageData)
    }

    return null
}

// Create blob URL for file preview
export const createBlobUrl = (file) => {
    if (!file) return null
    return URL.createObjectURL(file)
}

// Revoke blob URL to free memory
export const revokeBlobUrl = (url) => {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
    }
}
