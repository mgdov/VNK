import './assets/App.css'
import Home from './pages/Home/index'
import AdminApp from './pages/Admin/AdminApp';
import { Routes, Route } from "react-router-dom";
import Footer from './components/Footer/Footer';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  const routes = [] = [
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
    <AuthProvider>
      <div className="container max-w-[1200px] mx-auto px-[5px]">
        <Routes>
          {
            routes.map((obj) => <Route key={obj.path} path={obj.path} element={obj.element} />)
          }
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
