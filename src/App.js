import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserValidator from './components/UserValidator';
import AdminRoute from './components/AdminRoute';
import * as ROUTES from './utils/routes';

// Páginas públicas
import Home from './pages';
import Login from './pages/login';
import Map from './pages/map';
import EventsPage from './components/EventsPage';
import Perfil from './pages/perfil'; 
// Páginas administrativas
import { Dashboard, Eventos, Pistas, Usuarios } from './pages/admin';
import CreateAdmin from './components/CreateAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <UserValidator>
          <Routes>
            {/* Rotas públicas */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.MAP} element={<Map />} />
            <Route path={ROUTES.EVENTS} element={<EventsPage />} />
            <Route path="/perfil" element={<Perfil />} />
            
            {/* Rotas administrativas */}
            <Route path={ROUTES.ADMIN} element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path={ROUTES.ADMIN_HOME} element={<AdminRoute><Eventos /></AdminRoute>} />
            <Route path={ROUTES.CREATE_ADMIN} element={<AdminRoute><CreateAdmin /></AdminRoute>} />
            <Route path={ROUTES.ADMIN_ARTICLE} element={<AdminRoute><Pistas /></AdminRoute>} />
            <Route path={ROUTES.ADMIN_MANAGEMENT} element={<AdminRoute><Usuarios /></AdminRoute>} />
          </Routes>
        </UserValidator>
      </Router>
    </AuthProvider>
  );
}

export default App;
