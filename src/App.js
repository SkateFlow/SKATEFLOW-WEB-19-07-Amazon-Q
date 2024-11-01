import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Login from './pages/login';
import CreateAdmin from './components/CreateAdmin';
import Map from './pages/map';
import EventsPage from './components/EventsPage'; 
import ArticlesPage from './components/ArticlesPage';
import AdminPage from './components/AdminPage';
import AdminHome from './components/AdminHome';
import SkateflowNews from './components/ArticlesPage/FutureOfSkateboarding';
import Top10SkateParks from './components/ArticlesPage/Top10SkateParks';
import FemaleSkateGroups from './components/ArticlesPage/FemaleSkateGroups'; // Importando EventForm
import ArticleAdminPage from './components/AdminPage/ArticleAdminPage';
import AdminManagementPage from './components/AdminPage/AdminManagementPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="/map" element={<Map />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/adminhome' element={<AdminHome />} />
        <Route path="/articles/skateflow-news" element={<SkateflowNews />} />
        <Route path="/articles/top10-skateparks" element={<Top10SkateParks />} />
        <Route path="/articles/female-skate-groups" element={<FemaleSkateGroups />} />
        <Route path='/adminarticle' element={<ArticleAdminPage />} />
        <Route path='/admins' element={<AdminManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
