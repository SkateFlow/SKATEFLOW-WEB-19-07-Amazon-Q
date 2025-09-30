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
import { Dashboard, Eventos, Pistas, Usuarios } from './pages/admin';
import CreateAdmin from './components/CreateAdmin';

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
          <Route path={ROUTES.ADMIN} element={<Eventos />} />
          <Route path={ROUTES.ADMIN_HOME} element={<Dashboard />} />
          <Route path={ROUTES.CREATE_ADMIN} element={<CreateAdmin />} />
          <Route path={ROUTES.ADMIN_ARTICLE} element={<Pistas />} />
          <Route path={ROUTES.ADMIN_MANAGEMENT} element={<Usuarios />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
