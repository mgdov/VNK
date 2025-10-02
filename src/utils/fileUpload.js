// File upload utilities
const UPLOAD_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_UPLOAD_URL)
    ? import.meta.env.VITE_UPLOAD_URL
    : (typeof window !== 'undefined' ? `${window.location.origin}/upload` : 'http://localhost:3001/upload');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

// When we cannot upload to a server (e.g., production static hosting),
// we inline images as data URLs. To avoid HTTP 413 on MockAPI, keep
// inline images reasonably small.
const MAX_INLINE_IMAGE_BYTES = 250 * 1024; // ~250KB target for inlined base64
const DEFAULT_MAX_DIMENSION = 1280; // Resize longest side to this value

// Validate file before upload
const validateFile = (file) => {
    if (!file) {
        throw new Error('Файл не выбран');
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Размер файла превышает ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Неподдерживаемый тип файла. Разрешены: JPEG, PNG, GIF, WebP, SVG');
    }

    return true;
};

// Read a Blob/File to data URL
const blobToDataURL = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

// Read a File to an HTMLImageElement
const fileToImage = (file) => new Promise((resolve, reject) => {
    try {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    } catch (e) {
        reject(e);
    }
});

// Draw an image to canvas with max dimensions and return a Blob
const drawToCanvas = async (img, { maxDimension = DEFAULT_MAX_DIMENSION, mimeType = 'image/jpeg', quality = 0.8 } = {}) => {
    const { naturalWidth: w, naturalHeight: h } = img;
    let targetW = w;
    let targetH = h;

    // Scale preserving aspect ratio
    if (Math.max(w, h) > maxDimension) {
        if (w >= h) {
            targetW = maxDimension;
            targetH = Math.round((h / w) * maxDimension);
        } else {
            targetH = maxDimension;
            targetW = Math.round((w / h) * maxDimension);
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
    if (!blob) throw new Error('Не удалось сжать изображение');
    return blob;
};

// Compress/resize an image File to fit under the target size, iteratively reducing quality and dimensions.
const compressImageFile = async (file, { targetBytes = MAX_INLINE_IMAGE_BYTES } = {}) => {
    // Skip compression for SVGs; they're text and usually small.
    if (file.type === 'image/svg+xml') {
        return { blob: file, dataUrl: await blobToDataURL(file), convertedName: file.name };
    }

    // Load image
    const img = await fileToImage(file);

    // Choose output format. Prefer JPEG for better compression unless the original is webp.
    const preferredMime = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';

    const steps = [
        { maxDimension: DEFAULT_MAX_DIMENSION, quality: 0.8 },
        { maxDimension: DEFAULT_MAX_DIMENSION, quality: 0.7 },
        { maxDimension: DEFAULT_MAX_DIMENSION, quality: 0.6 },
        { maxDimension: 1024, quality: 0.7 },
        { maxDimension: 1024, quality: 0.6 },
        { maxDimension: 800, quality: 0.65 },
        { maxDimension: 720, quality: 0.6 },
        { maxDimension: 640, quality: 0.6 },
        { maxDimension: 560, quality: 0.6 },
    ];

    let lastBlob = null;
    for (const s of steps) {
        const blob = await drawToCanvas(img, { maxDimension: s.maxDimension, mimeType: preferredMime, quality: s.quality });
        lastBlob = blob;
        if (blob.size <= targetBytes) {
            const dataUrl = await blobToDataURL(blob);
            const convertedName = (file.name || 'image').replace(/\.(jpe?g|png|gif|webp)$/i, '') + (preferredMime === 'image/webp' ? '.webp' : '.jpg');
            return { blob, dataUrl, convertedName };
        }
    }

    // If still too big, return the smallest we could make
    const dataUrl = await blobToDataURL(lastBlob);
    const convertedName = (file.name || 'image').replace(/\.(jpe?g|png|gif|webp)$/i, '') + (preferredMime === 'image/webp' ? '.webp' : '.jpg');
    return { blob: lastBlob, dataUrl, convertedName };
};

// Upload file to server
export const uploadFile = async (file) => {
    try {
        validateFile(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'image');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки файла: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        return {
            src: result.url || result.fileUrl || result.path,
            title: file.name,
            rawFile: file
        };
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Превышено время ожидания загрузки файла');
        }
        console.error('Ошибка загрузки файла:', error);
        throw error;
    }
};

// Process image data in form
export const processImageData = async (data) => {
    const processedData = { ...data };

    // In production environments without a dedicated upload server, prefer inlining as data URLs
    const shouldUseDataUrlOnly = (typeof window !== 'undefined')
        && !(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_UPLOAD_URL)
        && window.location.hostname !== 'localhost'
        && window.location.hostname !== '127.0.0.1';

    // Helper to get raw file from possible shapes
    const getRaw = (val) => {
        if (!val) return null;
        if (Array.isArray(val) && val.length > 0) return val[0]?.rawFile || null;
        return val?.rawFile || null;
    };

    try {
        const raw = getRaw(data.avatar);
        if (raw) {
            // If we can upload to a server, prefer that path
            if (!shouldUseDataUrlOnly) {
                try {
                    // Try to compress before upload to reduce bandwidth
                    let toUploadFile = raw;
                    if (raw.type !== 'image/svg+xml' && raw.size > MAX_INLINE_IMAGE_BYTES) {
                        const { blob, convertedName } = await compressImageFile(raw, { targetBytes: MAX_INLINE_IMAGE_BYTES * 2 });
                        toUploadFile = new File([blob], convertedName || raw.name || 'image', { type: blob.type });
                    }
                    const uploadedImage = await uploadFile(toUploadFile);
                    processedData.avatar = uploadedImage;
                } catch (e) {
                    console.error('��шибка загрузки изображения поста, будет использован data URL:', e);
                    // Fall through to data URL path
                }
            }

            // If upload not possible or failed, create a compressed data URL fallback
            if (!processedData.avatar || !processedData.avatar.src) {
                try {
                    const { blob, dataUrl, convertedName } = await compressImageFile(raw, { targetBytes: MAX_INLINE_IMAGE_BYTES });

                    if (blob.size > MAX_INLINE_IMAGE_BYTES) {
                        // Still too big: warn with a clear error to avoid 413 on MockAPI
                        throw new Error('Изображение слишком большое для сохранения. Уменьшите размер (до ~250KB) или запустите локальный сервер загрузок и установите VITE_UPLOAD_URL.');
                    }

                    processedData.avatar = {
                        src: dataUrl,
                        title: convertedName || raw.name || 'image'
                    };
                } catch (e) {
                    console.warn('Не удалось создать сжатый data URL из файла:', e);
                }
            }
        }
    } catch (error) {
        console.warn('Fallback image processing failed:', error);
    }

    return processedData;
};

// Get image URL from various data formats
export const getImageUrl = (imageData) => {
    if (!imageData) return null;

    const normalizeUrl = (u) => {
        if (!u) return null;
        // Keep absolute and data/blob URLs as-is
        return u;
    };

    // If it's a JSON string (legacy storage), try to parse and extract URL
    if (typeof imageData === 'string') {
        const str = imageData.trim();
        try {
            if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
                const parsed = JSON.parse(str);
                return getImageUrl(parsed);
            }
        } catch {
            // fall through
        }
        return normalizeUrl(str);
    }

    // Common object shapes
    if (imageData?.src) return normalizeUrl(imageData.src);
    if (imageData?.url) return normalizeUrl(imageData.url);
    if (imageData?.fileUrl) return normalizeUrl(imageData.fileUrl);
    if (imageData?.path) return normalizeUrl(imageData.path);
    if (imageData?.imageUrl) return normalizeUrl(imageData.imageUrl);

    // Blob/File
    if (typeof Blob !== 'undefined' && imageData instanceof Blob) {
        return URL.createObjectURL(imageData);
    }

    return null;
};

// Create blob URL for file preview
export const createBlobUrl = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
};

// Revoke blob URL to free memory
export const revokeBlobUrl = (url) => {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
};
