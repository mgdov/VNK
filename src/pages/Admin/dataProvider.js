import { processImageData, getImageUrl } from '../../utils/fileUpload';

const apiUrl = "https://68d0487dec1a5ff33826f151.mockapi.io";

// Улучшенный HTTP клиент с обработкой ошибок
const httpClient = async (url, options = {}) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            signal: controller.signal,
            ...options,
        });

        clearTimeout(timeoutId);

        let json = null;
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            try {
                json = await res.clone().json();
            } catch (e) {
                console.warn("Failed to parse JSON response:", e);
            }
        }

        // Проверяем статус ответа
        if (!res.ok) {
            const errorMessage = json?.message || json?.error || `HTTP ${res.status}: ${res.statusText}`;
            throw new Error(errorMessage);
        }

        return { status: res.status, json };
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Запрос превысил время ожидания. Проверьте подключение к интернету.');
        }
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Ошибка сети. Проверьте подключение к интернету.');
        }
        throw error;
    }
};

// Функция для логирования ошибок
const logError = (operation, resource, error) => {
    console.error(`DataProvider ${operation} error for ${resource}:`, error);
};

// Функция для валидации данных
const validateData = (data, requiredFields = []) => {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
    }
    return true;
};

const dataProvider = {
    getList: async (resource, params) => {
        try {
            // Безопасное извлечение параметров
            const pagination = params?.pagination || {};
            const sort = params?.sort || {};
            const filter = params?.filter || {};

            const page = pagination.page || 1;
            const perPage = pagination.perPage || 10;
            const field = sort.field;
            const order = sort.order;

            let url = `${apiUrl}/${resource}`;
            const queryParams = new URLSearchParams();

            // Пагинация
            queryParams.append('page', page);
            queryParams.append('limit', perPage);

            // Сортировка
            if (field && order) {
                queryParams.append('sortBy', field);
                queryParams.append('order', order.toLowerCase());
            }

            // Обработка фильтров - проверяем разные форматы
            if (filter) {
                if (Array.isArray(filter)) {
                    // Если filter - массив, обрабатываем каждый элемент
                    filter.forEach(filterItem => {
                        if (filterItem && typeof filterItem === 'object') {
                            Object.entries(filterItem).forEach(([key, value]) => {
                                if (value !== undefined && value !== null && value !== '') {
                                    queryParams.append(key, value);
                                }
                            });
                        }
                    });
                } else if (typeof filter === 'object') {
                    // Если filter - объект, обрабатываем его свойства
                    Object.entries(filter).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== '') {
                            queryParams.append(key, value);
                        }
                    });
                }
            }

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const { json } = await httpClient(url);

            return {
                data: json || [],
                total: json?.length || 0,
                pageInfo: {
                    hasNextPage: json?.length === perPage,
                    hasPreviousPage: page > 1
                }
            };
        } catch (error) {
            logError('getList', resource, error);
            throw error;
        }
    },

    getOne: async (resource, params) => {
        try {
            if (!params.id) {
                throw new Error('ID записи не указан');
            }

            const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`);

            if (!json) {
                throw new Error(`Запись с ID ${params.id} не найдена`);
            }

            return { data: json };
        } catch (error) {
            logError('getOne', resource, error);
            throw error;
        }
    },

    create: async (resource, params) => {
        try {
            let payload = params.data || {};

            if (resource === 'items') {
                // Валидация полей новостей
                validateData(payload, ['title', 'content']);
                // Обрабатываем изображения только для новостей
                const processedData = await processImageData(payload);
                payload = processedData;
            }

            // Добавляем временные метки
            const dataWithTimestamps = {
                ...payload,
                createdAt: payload.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const { json } = await httpClient(`${apiUrl}/${resource}`, {
                method: "POST",
                body: JSON.stringify(dataWithTimestamps),
            });

            return { data: json };
        } catch (error) {
            logError('create', resource, error);
            throw error;
        }
    },

    update: async (resource, params) => {
        try {
            if (!params.id) {
                throw new Error('ID записи не указан');
            }

            let updateData = { ...(params.data || {}) };

            if (resource === 'items') {
                // Валидация только для новостей
                if (!updateData.title || !updateData.content) {
                    throw new Error('Заголовок и содержание обязательны');
                }
                // Обрабатываем изображения только для новостей
                const processedData = await processImageData(updateData);
                updateData = processedData;
            }

            // Подготавливаем данные для обновления
            updateData = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            // Удаляем пустые поля
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === '' || updateData[key] === null || updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            const { json, status } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
                method: "PUT",
                body: JSON.stringify(updateData),
            });

            if (status >= 200 && status < 300) {
                return { data: json };
            }

            throw new Error(`Обновление не удалось. Статус: ${status}`);
        } catch (error) {
            logError('update', resource, error);
            throw error;
        }
    },

    delete: async (resource, params) => {
        try {
            if (!params.id) {
                throw new Error('ID записи не указан');
            }

            // Сначала проверяем, существует ли запись
            try {
                await httpClient(`${apiUrl}/${resource}/${params.id}`);
            } catch (error) {
                if (error.message.includes('404')) {
                    throw new Error('Запись не найдена');
                }
                throw error;
            }

            const { status } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
                method: "DELETE",
            });

            if (status === 200 || status === 204) {
                return { data: { id: params.id } };
            }

            throw new Error(`Удаление не удалось. Статус: ${status}`);
        } catch (error) {
            logError('delete', resource, error);
            throw error;
        }
    },

    // Дополнительные методы для расширенной функциональности
    getMany: async (resource, params) => {
        try {
            const { ids } = params;
            const promises = ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`)
                    .then(({ json }) => json)
                    .catch(() => null)
            );

            const results = await Promise.all(promises);
            const data = results.filter(Boolean);

            return { data };
        } catch (error) {
            logError('getMany', resource, error);
            throw error;
        }
    },

    getManyReference: async (resource, params) => {
        try {
            const { target, id } = params;
            const { json } = await httpClient(`${apiUrl}/${resource}?${target}=${id}`);

            return {
                data: json || [],
                total: json?.length || 0
            };
        } catch (error) {
            logError('getManyReference', resource, error);
            throw error;
        }
    },

    updateMany: async (resource, params) => {
        try {
            const { ids, data } = params;
            const promises = ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        ...data,
                        updatedAt: new Date().toISOString()
                    }),
                }).then(({ json }) => json)
            );

            const results = await Promise.all(promises);
            return { data: results };
        } catch (error) {
            logError('updateMany', resource, error);
            throw error;
        }
    },

    deleteMany: async (resource, params) => {
        try {
            const { ids } = params;
            const promises = ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: "DELETE",
                }).then(() => ({ id }))
            );

            const results = await Promise.all(promises);
            return { data: results };
        } catch (error) {
            logError('deleteMany', resource, error);
            throw error;
        }
    }
};

export default dataProvider;
