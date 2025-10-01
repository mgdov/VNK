import {
    Admin,
    Resource,
    Layout,
    useSidebarState
} from "react-admin";
import {
    Box,
    Typography,
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Article as ArticleIcon,
    LocalGasStation as LocalGasStationIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mockApiProvider from "./dataProvider";
import NewsList from './NewsLists'
import NewsCreate from "./NewCreate";
import NewsEdit from "./NewEdit";
import PricesList from './PricesList'
import PricesCreate from './PricesCreate'
import PricesEdit from './PricesEdit'
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

// Кастомный AppBar
const CustomAppBar = () => {
    const { logout, user } = useAuth();

    return (
        <MuiAppBar
            position="static"
            sx={{
                backgroundColor: '#1976d2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    VNK Админ Панель
                </Typography>

                {/* Информация о пользователе и кнопка выхода */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {user.username}
                        </Typography>
                    )}
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={logout}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Выйти
                    </Button>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
};

// Кастомное меню
const CustomMenu = () => {
    const [open] = useSidebarState();

    return (
        <Box sx={{
            width: open ? 280 : 70,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
            {/* Заголовок */}
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
                minHeight: 64,
                display: 'flex',
                alignItems: 'center'
            }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#1976d2',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ArticleIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    {open && (
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                            VNK Admin
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Навигация */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                <IconButton component={Link} to="/admin/items" color="primary" aria-label="Новости">
                    <ArticleIcon />
                </IconButton>
                <IconButton component={Link} to="/admin/price" color="primary" aria-label="Цены">
                    <LocalGasStationIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

// Кастомный Layout
const CustomLayout = (props) => (
    <Layout
        {...props}
        appBar={CustomAppBar}
        sidebar={CustomMenu}
        sx={{
            '& .RaLayout-content': {
                backgroundColor: '#f5f5f5',
                minHeight: '100vh'
            }
        }}
    />
);

export default function AdminPage() {
    return (
        <ProtectedRoute>
            <div style={{ height: "100vh", backgroundColor: '#f5f5f5' }}>
                <Admin
                    basename="/admin"
                    dataProvider={mockApiProvider}
                    layout={CustomLayout}
                    theme={{
                        palette: {
                            primary: {
                                main: '#1976d2',
                            },
                            secondary: {
                                main: '#dc004e',
                            },
                            background: {
                                default: '#f5f5f5',
                            },
                        },
                        typography: {
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        },
                        components: {
                            MuiCard: {
                                styleOverrides: {
                                    root: {
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    },
                                },
                            },
                            MuiButton: {
                                styleOverrides: {
                                    root: {
                                        borderRadius: 8,
                                        textTransform: 'none',
                                    },
                                },
                            },
                        },
                    }}
                >
                    <Resource
                        name="items"
                        list={NewsList}
                        create={NewsCreate}
                        edit={NewsEdit}
                        options={{ label: 'Новости' }}
                    />
                    <Resource
                        name="price"
                        list={PricesList}
                        create={PricesCreate}
                        edit={PricesEdit}
                        options={{ label: 'Цены на топливо' }}
                    />
                </Admin>
            </div>
        </ProtectedRoute>
    );
}