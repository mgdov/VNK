import './assets/App.css'
import { lazy, Suspense, useMemo } from 'react'
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext'

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home/index'))
const AdminApp = lazy(() => import('./pages/Admin/AdminApp'))
const Review = lazy(() => import('./pages/Reviews'))
const Header = lazy(() => import('./components/Header'))
const Footer = lazy(() => import('./components/Footer/Footer'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

// Route configuration
const About = lazy(() => import('./pages/About'))

const ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/review', element: <Review /> },
  { path: '/admin/*', element: <AdminApp /> }
]

function AppContent() {
  const location = useLocation()
  const isAdminRoute = useMemo(
    () => location.pathname.toLowerCase().startsWith('/admin'),
    [location.pathname]
  )

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-[1200px] mx-auto px-2 sm:px-4 flex-1 w-full">
        {!isAdminRoute && (
          <Suspense fallback={<div className="h-20" />}>
            <Header />
          </Suspense>
        )}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </div>
      {!isAdminRoute && (
        <Suspense fallback={<div className="h-32" />}>
          <Footer />
        </Suspense>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
