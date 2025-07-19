import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import * as ROUTES from './utils/routes';

// Páginas públicas
import Home from './pages';
import Login from './pages/login';
import Map from './pages/map';
import EventsPage from './components/EventsPage'; 
import ArticlesPage from './components/ArticlesPage';
import SkateflowNews from './components/ArticlesPage/FutureOfSkateboarding';
import Top10SkateParks from './components/ArticlesPage/Top10SkateParks';
import FemaleSkateGroups from './components/ArticlesPage/FemaleSkateGroups';

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
          <Route path={ROUTES.ARTICLES} element={<ArticlesPage />} />
          <Route path={ROUTES.ARTICLE_SKATEFLOW_NEWS} element={<SkateflowNews />} />
          <Route path={ROUTES.ARTICLE_TOP10_SKATEPARKS} element={<Top10SkateParks />} />
          <Route path={ROUTES.ARTICLE_FEMALE_SKATE_GROUPS} element={<FemaleSkateGroups />} />
          
          {/* Rotas protegidas (apenas para administradores) */}
          <Route path={ROUTES.ADMIN} element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ADMIN_HOME} element={
            <ProtectedRoute requireAdmin={true}>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.CREATE_ADMIN} element={
            <ProtectedRoute requireAdmin={true}>
              <CreateAdmin />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ADMIN_ARTICLE} element={
            <ProtectedRoute requireAdmin={true}>
              <ArticleAdminPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ADMIN_MANAGEMENT} element={
            <ProtectedRoute requireAdmin={true}>
              <AdminManagementPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
