import './assets/App.css'
import Home from './pages/Home/index'
import AdminApp from './pages/Admin/AdminApp';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Footer from './components/Footer/Footer';
import { AuthProvider } from './contexts/AuthContext';
import Review from './pages/Reviews';
import Header from './components/Header';


function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');
  const routes = [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/Review',
      element: <Review />
    },
    {

      path: '/Admin/*',
      element: <AdminApp />
    },

  ]
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-[1200px] mx-auto px-[5px] flex-1 w-full">
        {!isAdminRoute && <Header />}
        <Routes>
          {
            routes.map((obj) => <Route key={obj.path} path={obj.path} element={obj.element} />)
          }
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
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
