import {
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    required,
    minLength,
    maxLength,
    regex,
    email,
    ImageInput,
    ImageField,
    useNotify,
    useRedirect,
    useRecordContext,
    TopToolbar,
    ListButton
} from "react-admin";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Alert,
    Chip
} from '@mui/material';
import {
    Article as ArticleIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Edit as EditIcon,
    List as ListIcon
} from '@mui/icons-material';

// Валидация для заголовка
const validateTitle = [required('Заголовок обязателен'), minLength(3, 'Минимум 3 символа'), maxLength(100, 'Максимум 100 символов')];

// Валидация для контента
const validateContent = [required('Контент обязателен'), minLength(10, 'Минимум 10 символов'), maxLength(2000, 'Максимум 2000 символов')];

// Валидация для имени автора
const validateName = [required('Имя автора обязательно'), minLength(2, 'Минимум 2 символа'), maxLength(50, 'Максимум 50 символов')];

// Валидация для даты
const validateDate = [required('Дата обязательна')];

// Кастомная панель инструментов
const EditActions = () => (
    <TopToolbar>
        <ListButton
            icon={<ListIcon />}
            label="К списку новостей"
            sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#1565c0'
                }
            }}
        />
    </TopToolbar>
);

// Компонент для отображения информации о записи
const RecordInfo = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box mb={3}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon color="primary" />
                Редактирование новости #{record.id}
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
                <Chip
                    label={`ID: ${record.id}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
                <Chip
                    label={`Создано: ${new Date(record.createdAt).toLocaleDateString('ru-RU')}`}
                    color="default"
                    variant="outlined"
                    size="small"
                />
                {record.name && (
                    <Chip
                        label={`Автор: ${record.name}`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                    />
                )}
            </Box>
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

export default function NewsEdit(props) {
    const notify = useNotify();
    const redirect = useRedirect();

    const handleSave = (data) => {
        // Обновляем дату изменения
        data.updatedAt = new Date().toISOString();

        notify('Новость успешно обновлена!', { type: 'success' });
        return data;
    };

    return (
        <Edit
            {...props}
            title="Редактирование новости"
            transform={handleSave}
            actions={<EditActions />}
            sx={{
                '& .RaEdit-main': {
                    backgroundColor: '#f5f5f5',
                }
            }}
        >
            <SimpleForm
                sx={{
                    '& .RaSimpleForm-main': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        padding: 3,
                    }
                }}
            >
                <RecordInfo />

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArticleIcon color="primary" />
                        Основная информация
                    </Typography>
                    <Divider />
                </Box>

                <TextInput
                    source="title"
                    label="Заголовок новости"
                    validate={validateTitle}
                    fullWidth
                    sx={{ mb: 2 }}
                    helperText="Введите заголовок новости (3-100 символов)"
                />

                <TextInput
                    source="content"
                    label="Содержание новости"
                    multiline
                    rows={6}
                    validate={validateContent}
                    fullWidth
                    sx={{ mb: 2 }}
                    helperText="Введите содержание новости (10-2000 символов)"
                />

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="primary" />
                        Информация об авторе
                    </Typography>
                    <Divider />
                </Box>

                <TextInput
                    source="name"
                    label="Имя автора"
                    validate={validateName}
                    fullWidth
                    sx={{ mb: 2 }}
                    helperText="Введите имя автора (2-50 символов)"
                />

                <ImageInput
                    source="avatar"
                    label="Изображение поста"
                    accept="image/*"
                    sx={{ mb: 2 }}
                    helperText="Загрузите изображение для поста (будет отображаться в новостях)"
                >
                    <ImageField source="src" title="title" />
                </ImageInput>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon color="primary" />
                        Дата публикации
                    </Typography>
                    <Divider />
                </Box>

                <DateInput
                    source="createdAt"
                    label="Дата публикации"
                    validate={validateDate}
                    fullWidth
                    sx={{ mb: 2 }}
                    helperText="Выберите дату публикации новости"
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Изменения будут сохранены и отображены на главной странице сайта.
                    </Typography>
                </Alert>
            </SimpleForm>
        </Edit>
    );
}
