import './assets/App.css'
import Home from './pages/Home/index'
import AdminApp from './pages/Admin/AdminApp';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Footer from './components/Footer/Footer';
import { AuthProvider } from './contexts/AuthContext';


function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');
  const routes = [
    {
      path: '/',
      element: <Home />
    },
    {

      path: '/Admin/*',
      element: <AdminApp />
    },

  ]
  return (
    <>
      <div className="container max-w-[1200px] mx-auto px-[5px]">
        <Routes>
          {
            routes.map((obj) => <Route key={obj.path} path={obj.path} element={obj.element} />)
          }
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
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
