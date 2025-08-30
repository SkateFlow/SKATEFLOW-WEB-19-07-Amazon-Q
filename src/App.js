import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import * as ROUTES from './utils/routes';

// Páginas públicas
import Home from './pages';
import Login from './pages/login';
import Map from './pages/map';
import EventsPage from './components/EventsPage'; 
// Páginas administrativas
import AdminPage from './components/AdminPage';
import AdminHome from './components/AdminHome';
import CreateAdmin from './components/CreateAdmin';
import ArticleAdminPage from './components/AdminPage/ArticleAdminPage';
import AdminManagementPage from './components/AdminPage/AdminManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.MAP} element={<Map />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          
          {/* Rotas administrativas */}
          <Route path={ROUTES.ADMIN} element={<AdminPage />} />
          <Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} />
          <Route path={ROUTES.CREATE_ADMIN} element={<CreateAdmin />} />
          <Route path={ROUTES.ADMIN_ARTICLE} element={<ArticleAdminPage />} />
          <Route path={ROUTES.ADMIN_MANAGEMENT} element={<AdminManagementPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
