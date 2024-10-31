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
import EventList from './components/EventsPage/EventList';
import EventForm from './components/EventsPage/EventForm'; // Importando EventForm

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
        <Route path="/event-list" element={<EventList />} />
        <Route path="/event-form" element={<EventForm fetchEvents={() => {}} event={{}} setEvent={() => {}} isEditing={false} setIsEditing={() => {}} />} />
      </Routes>
    </Router>
  );
}

export default App;
