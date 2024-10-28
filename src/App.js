import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages'; // Sua página inicial
import SuccessPage from './components/SucessPage/SucessPage';
import Login from './pages/login'; // Mantenha o nome do import consistente
import CreateAdmin from './components/CreateAdmin'; // Altere para o caminho do seu novo componente
import Map from './pages/map';
import EventsPage from './components/EventsPage'; 
import ArticlesPage from './components/ArticlesPage' // Correto se o arquivo se chama map.js

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-admin" element={<CreateAdmin />} /> 
        <Route path="/map" element={<Map />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/articles" element={<ArticlesPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
