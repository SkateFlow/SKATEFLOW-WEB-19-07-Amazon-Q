import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages'; // Sua página inicial
import Login from './pages/login'; // Mantenha o nome do import consistente
import CreateAdmin from './components/CreateAdmin'; // Altere para o caminho do seu novo componente
import Map from './pages/map';
import EventsPage from './components/EventsPage'; 
import ArticlesPage from './components/ArticlesPage'
import AdminPage from './components/AdminPage';// Correto se o arquivo se chama map.js
import AdminHome from './components/AdminHome';
import EventList from './components/EventsPage/EventList';

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
        <Route path="/event-list" component={EventList} />
      </Routes>
    </Router>
  );
}

export default App;
