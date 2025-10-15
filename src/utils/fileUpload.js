// File upload utilities
// NOTE: We don't use a custom upload server for production. The project uses MockAPI
// to store news items. To ensure images persist without introducing a server,
// we convert image files to base64 data URLs and store them in the MockAPI record.
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB (max input file size)
const MAX_BASE64_PAYLOAD = 200 * 1024 // target max size for stored base64 (200KB) to be safe for MockAPI
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

// Resize/compress settings
const DEFAULT_MAX_WIDTH = 800
const DEFAULT_MAX_HEIGHT = 800
const MIN_QUALITY = 0.45

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

// Instead of uploading to an external server, convert file to data URL.
// This allows storing the image directly inside the MockAPI JSON record so
// it persists across reloads and deployments without a dedicated file server.
export const uploadFile = async (file) => {
    validateFile(file)

    // If SVG - keep as data URL via FileReader (SVG is text-based)
    if (file.type === 'image/svg+xml') {
        const toDataUrl = (f) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(f);
        });
        try {
            const dataUrl = await toDataUrl(file)
            return { src: dataUrl, title: file.name, rawFile: file }
        } catch (e) {
            console.error('SVG to data URL failed:', e)
            throw new Error('Не удалось обработать SVG-файл')
        }
    }
    // If SVG - sanitize and keep as data URL (SVG is text-based)
    if (file.type === 'image/svg+xml') {
        // DOMPurify is safe in browser environments (window exists)
        try {
            const text = await file.text();
            // Use DOMPurify if available
            let clean = text;
            if (typeof window !== 'undefined') {
                // Lazy load DOMPurify from global require if available
                try {
                    // eslint-disable-next-line no-undef
                    const DOMPurify = (await import('dompurify')).default;
                    clean = DOMPurify.sanitize(text, { USE_PROFILES: { svg: true } });
                } catch (e) {
                    console.warn('DOMPurify unavailable, proceeding without SVG sanitization:', e);
                }
            }

            // Use TextEncoder to properly encode UTF-8 strings to base64
            const uint8Array = new TextEncoder().encode(clean);
            let binary = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binary += String.fromCharCode(uint8Array[i]);
            }
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(binary)}`;
            return { src: svgDataUrl, title: file.name };
        } catch (e) {
            console.error('SVG processing failed:', e)
            throw new Error('Не удалось обработать SVG-файл')
        }
    }

    // Helper: convert Blob to dataURL
    const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    // Helper: create Image element from File using object URL
    const loadImage = (fileOrBlob) => new Promise((resolve, reject) => {
        const url = URL.createObjectURL(fileOrBlob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };
        img.src = url;
    });

    // Helper: resize and compress via canvas to desired quality/size (create thumbnail)
    const createThumbnailBlob = async (file, options = {}) => {
        const maxWidth = options.maxWidth || DEFAULT_MAX_WIDTH;
        const maxHeight = options.maxHeight || DEFAULT_MAX_HEIGHT;
        let quality = options.quality ?? 0.85;

        const img = await loadImage(file);
        const { width, height } = img;
        let scale = Math.min(1, maxWidth / width, maxHeight / height);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // function to produce blob at given dimensions and quality
        const produceBlob = async (w, h, q) => new Promise((res) => {
            canvas.width = w;
            canvas.height = h;
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(res, 'image/webp', q);
        });

        // Start with scaled dimensions
        let targetW = Math.max(1, Math.round(width * scale));
        let targetH = Math.max(1, Math.round(height * scale));

        // Try decreasing quality first
        for (let q = quality; q >= MIN_QUALITY; q -= 0.1) {
            const blob = await produceBlob(targetW, targetH, q);
            if (blob && blob.size <= MAX_BASE64_PAYLOAD) return blob;
        }

        // If still too large, progressively downscale and try again
        let currentW = targetW;
        let currentH = targetH;
        for (let attempt = 0; attempt < 6; attempt++) {
            currentW = Math.max(1, Math.round(currentW * 0.8));
            currentH = Math.max(1, Math.round(currentH * 0.8));
            for (let q = 0.8; q >= MIN_QUALITY; q -= 0.1) {
                const blob = await produceBlob(currentW, currentH, q);
                if (blob && blob.size <= MAX_BASE64_PAYLOAD) return blob;
            }
        }

        // last resort - smallest possible
        return await produceBlob(Math.max(1, Math.round(width * 0.1)), Math.max(1, Math.round(height * 0.1)), MIN_QUALITY);
    };

    try {
        // Create aggressive thumbnail blob (webp)
        const thumbBlob = await createThumbnailBlob(file, { maxWidth: DEFAULT_MAX_WIDTH, maxHeight: DEFAULT_MAX_HEIGHT, quality: 0.85 });
        const dataUrl = await blobToDataUrl(thumbBlob);
        if (!dataUrl || dataUrl.length === 0) throw new Error('Не удалось получить data URL');
        if (dataUrl.length > MAX_BASE64_PAYLOAD * 1.37) {
            throw new Error('Сжатое изображение всё ещё слишком велико для хранения. Попробуйте выбрать меньшую картинку.');
        }
        return { src: dataUrl, title: file.name };
    } catch (error) {
        console.error('Ошибка преобразования/сжатия файла в data URL:', error);
        throw new Error(error.message || 'Не удалось подготовить файл для сохранения');
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
        console.error('Ошибка обработки изображения поста:', error)
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
