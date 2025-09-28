
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    TopToolbar,
    CreateButton,
    ExportButton,
    FilterForm,
    TextInput,
    DateInput,
    FunctionField,
    useListContext,
    useDelete,
    useNotify,
    useRefresh,
    useRecordContext
} from 'react-admin';
import {
    Typography,
    Box,
    Chip,
    Avatar,
    Tooltip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useState } from 'react';

// Компонент для отображения изображения поста с fallback
const ImageField = ({ record, source }) => {
    const image = record?.[source];
    const name = record?.name || 'Пользователь';

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Avatar
                src={image}
                alt={name}
                sx={{ width: 32, height: 32 }}
            >
                {name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" noWrap>
                {name}
            </Typography>
        </Box>
    );
};

// Компонент для отображения контента с ограничением длины
const ContentField = ({ record, source }) => {
    const content = record?.[source] || '';
    const maxLength = 100;
    const truncated = content.length > maxLength ? content.substring(0, maxLength) + '...' : content;

    return (
        <Tooltip title={content} arrow>
            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                {truncated}
            </Typography>
        </Tooltip>
    );
};

// Компонент для отображения статуса
const StatusField = ({ record }) => {
    const isRecent = record?.createdAt &&
        new Date(record.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (
        <Chip
            label={isRecent ? 'Новое' : 'Обычное'}
            color={isRecent ? 'success' : 'default'}
            size="small"
        />
    );
};

// Фильтры для списка
const NewsFilter = () => (
    <FilterForm>
        <TextInput source="title" label="Заголовок" />
        <TextInput source="name" label="Автор" />
        <DateInput source="createdAt" label="Дата создания" />
    </FilterForm>
);


// Кастомная кнопка удаления с useDelete()
const CustomDeleteButton = () => {
    const record = useRecordContext();
    const [deleteOne, { isLoading }] = useDelete();
    const notify = useNotify();
    const refresh = useRefresh();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteOne('items', {
                id: record.id,
                previousData: record
            });
            notify('Новость успешно удалена!', { type: 'success' });
            refresh();
            setOpen(false);
        } catch (error) {
            notify('Ошибка при удалении новости: ' + error.message, { type: 'error' });
        }
    };

    return (
        <>
            <Tooltip title="Удалить новость">
                <IconButton
                    onClick={() => setOpen(true)}
                    disabled={isLoading}
                    sx={{
                        color: '#d32f2f',
                        '&:hover': {
                            backgroundColor: '#ffebee',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить новость "{record?.title}"?
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Кастомная кнопка фильтрации
const CustomFilterButton = () => {
    const { showFilters, setFilters } = useListContext();
    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(!show);
        setFilters({}, []);
    };

    return (
        <Button
            onClick={handleClick}
            startIcon={<FilterIcon />}
            variant={show ? "contained" : "outlined"}
            size="small"
        >
            Фильтры
        </Button>
    );
};

// Верхняя панель инструментов
const ListActions = () => (
    <TopToolbar>
        <CustomFilterButton />
        <CreateButton
            sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#45a049'
                }
            }}
        />
        <ExportButton />
    </TopToolbar>
);

export default function NewsList(props) {
    return (
        <List
            {...props}
            title="Управление новостями"
            actions={<ListActions />}
            filters={<NewsFilter />}
            perPage={10}
            sort={{ field: 'createdAt', order: 'DESC' }}
            sx={{
                '& .RaList-main': {
                    backgroundColor: '#f5f5f5',
                }
            }}
        >
            <Datagrid
                rowClick="edit"
                sx={{
                    '& .RaDatagrid-table': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                    '& .RaDatagrid-headerCell': {
                        backgroundColor: '#f8f9fa',
                        fontWeight: 'bold',
                        color: '#495057',
                    },
                    '& .RaDatagrid-rowCell': {
                        borderBottom: '1px solid #e9ecef',
                    },
                    '& .RaDatagrid-row:hover': {
                        backgroundColor: '#f8f9fa',
                    }
                }}
            >
                <TextField
                    source="id"
                    label="ID"
                    sx={{ minWidth: 60 }}
                />
                <TextField
                    source="title"
                    label="Заголовок"
                    sx={{ minWidth: 200, fontWeight: 'bold' }}
                />
                <FunctionField
                    label="Контент"
                    render={(record) => <ContentField record={record} source="content" />}
                />
                <FunctionField
                    label="Автор"
                    render={(record) => <ImageField record={record} source="avatar" />}
                />
                <DateField
                    source="createdAt"
                    label="Дата создания"
                    showTime
                    sx={{ minWidth: 150 }}
                />
                <FunctionField
                    label="Статус"
                    render={(record) => <StatusField record={record} />}
                />
                <EditButton
                    icon={<EditIcon />}
                    sx={{
                        color: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#e3f2fd',
                            transform: 'scale(1.1)'
                        }
                    }}
                />
                <FunctionField
                    render={() => <CustomDeleteButton />}
                />
            </Datagrid>
        </List>
    );
}
