# Сервер загрузки медиафайлов

Этот сервер обрабатывает загрузку изображений для новостей.

## Установка

```bash
cd server
npm install
```

## Запуск

```bash
# Обычный запуск
npm start

# Запуск в режиме разработки (с автоперезагрузкой)
npm run dev
```

## API

### POST /upload
Загружает файл на сервер.

**Параметры:**
- `file` - файл изображения (multipart/form-data)

**Ответ:**
```json
{
  "success": true,
  "url": "http://localhost:3001/uploads/filename.jpg",
  "filename": "filename.jpg",
  "originalName": "original.jpg",
  "size": 12345
}
```

## Настройки

- **Порт:** 3001
- **Папка загрузки:** `public/uploads/`
- **Максимальный размер файла:** 5MB
- **Разрешенные типы:** только изображения

## Структура файлов

```
server/
├── upload.js          # Основной файл сервера
├── package.json       # Зависимости
└── README.md         # Документация

public/
└── uploads/          # Папка для загруженных файлов
```
