import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaHeart, FaStar, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import CreatePistaModal from '../components/CreatePistaModal';
import PistaPopup from '../components/PistaPopup';
import AllPistasModal from '../components/AllPistasModal';
import { fetchSkateParks } from '../services/skateParksService';

// Carregar Leaflet
if (typeof window !== 'undefined' && !window.L) {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  script.crossOrigin = '';
  document.head.appendChild(script);
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  height: calc(100vh - 72px);
  padding-top: 72px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidePanel = styled.div`
  width: 400px;
  background: #edf2f7;
  border-right: 1px solid #cbd5e0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 50vh;
  }
`;

const MapPanel = styled.div`
  flex: 1;
  position: relative;
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid #cbd5e0;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #1a237e 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #2d3748;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #4a5568;
  margin: 0 0 16px 0;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  background: #ffffff;
  color: #2d3748;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a5568;
  width: 16px;
  height: 16px;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
`;

const FilterBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterBadge = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #cbd5e0;
  background: ${props => props.active ? '#3182ce' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#2d3748'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SpotsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const SpotCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  ${props => props.isSelected && `
    border-color: #3182ce;
    box-shadow: 0 8px 25px rgba(49, 130, 206, 0.3);
  `}
`;

const SpotImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const SpotName = styled.h3`
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  font-size: 16px;
`;

const SpotDescription = styled.p`
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const SpotLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 8px;
`;

const SpotStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
`;

const FooterStats = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #cbd5e0;
  text-align: center;
  font-size: 14px;
  color: #4a5568;
`;

const NotificationMessage = styled.div`
  position: fixed;
  top: 84px;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.show ? '0' : '-100%'});
  background: #11406dff;
  color: white;
  padding: 16px 32px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: auto;
  min-width: fit-content;
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.3s ease;
`;



const Map = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPista, setSelectedPista] = useState(null);
  const [showAllPistasModal, setShowAllPistasModal] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  
  const showAlreadyHereMessage = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  // Expor função globalmente para o navbar
  useEffect(() => {
    window.showMapNotification = showAlreadyHereMessage;
    return () => {
      delete window.showMapNotification;
    };
  }, []);

  useEffect(() => {
    loadSkateParks();
    
    // Verificar se o mapa já foi inicializado
    const mapContainer = document.getElementById('map');
    if (mapContainer && !mapContainer._leaflet_id && window.L) {
      const map = window.L.map('map').setView([-23.5505, -46.6333], 13);
      
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      window.L.marker([-23.5505, -46.6333]).addTo(map)
        .bindPopup('São Paulo - Pistas de Skate<br> Explore as melhores pistas da cidade.')
        .openPopup();
    }
  }, []);

  const loadSkateParks = async () => {
    setLoading(true);
    try {
      const data = await fetchSkateParks();
      setSpots(data);
    } catch (error) {
      console.error('Erro ao carregar pistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePista = (newPista) => {
    const updatedSpots = [...spots, newPista];
    setSpots(updatedSpots);
    
    // Adicionar marcador no mapa se tiver coordenadas
    if (newPista.latitude && newPista.longitude && window.L) {
      const mapContainer = document.getElementById('map');
      if (mapContainer && mapContainer._leaflet_id) {
        const map = window.L.map('map');
        const marker = window.L.marker([parseFloat(newPista.latitude), parseFloat(newPista.longitude)])
          .addTo(map)
          .bindPopup(`<b>${newPista.nome}</b><br>${newPista.descricao}`);
        
        marker.on('click', () => {
          handlePistaClick(newPista);
        });
      }
    }
  };

  const handlePistaClick = (pista) => {
    setSelectedPista(pista);
  };

  const spotTypes = ['todos', 'bowl', 'street', 'park'];


  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'todos' || spot.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <PageContainer>
      <ScrollToTop />
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} scrollNav={true} />
      <NotificationMessage show={showNotification}>
        Você já está nessa página!
      </NotificationMessage>
      
      <MainContent>
        <SidePanel>
          <Header>
            <Title>Descubra Pistas</Title>
            <Subtitle>Explore as melhores pistas de skate da cidade</Subtitle>
            
            <SearchContainer>
              <SearchIcon />
              <SearchInput
                placeholder="Buscar pistas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <FiltersContainer>
              <FilterGroup>
                <FaFilter size={14} color="#718096" />
                <FilterLabel>Tipo:</FilterLabel>
              </FilterGroup>
              <FilterBadges>
                {spotTypes.map(type => (
                  <FilterBadge
                    key={type}
                    active={typeFilter === type}
                    onClick={() => setTypeFilter(type)}
                  >
                    {type === 'todos' ? 'Todos' : type}
                  </FilterBadge>
                ))}
              </FilterBadges>
              

            </FiltersContainer>
          </Header>
          
          <SpotsList>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#4a5568' }}>
                Carregando pistas reais do Brasil...
              </div>
            ) : filteredSpots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#4a5568' }}>
                Nenhuma pista encontrada com os filtros aplicados.
              </div>
            ) : (
              filteredSpots.map(spot => (
                <SpotCard
                  key={spot.id}
                  isSelected={selectedSpot?.id === spot.id}
                  onClick={() => handlePistaClick(spot)}
                >
                  <SpotImage src={spot.images[0]} alt={spot.name} />
                  <SpotName>{spot.name}</SpotName>
                  <SpotDescription>{spot.description}</SpotDescription>
                  <SpotLocation>
                    <FaMapMarkerAlt />
                    <span>{spot.location}</span>
                  </SpotLocation>
                  <SpotStats>
                    <StatItem>
                      <FaStar color="#3182ce" />
                      <span style={{ color: '#4a5568' }}>{spot.rating}</span>
                    </StatItem>
                    <StatItem>
                      <FaHeart color="#4a5568" />
                      <span style={{ color: '#4a5568' }}>{spot.likes}</span>
                    </StatItem>
                  </SpotStats>
                </SpotCard>
              ))
            )}
          </SpotsList>
          
          <FooterStats>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{filteredSpots.length} de {spots.length} pistas encontradas</span>
              <button 
                onClick={() => setShowAllPistasModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Ver mais
              </button>
            </div>
          </FooterStats>
        </SidePanel>
        
        <MapPanel>
          <div 
            id="map" 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '8px' 
            }}
          />
        </MapPanel>
      </MainContent>
      
      <CreatePistaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePista}
      />
      
      {selectedPista && (
        <PistaPopup
          pista={selectedPista}
          onClose={() => setSelectedPista(null)}
        />
      )}
      
      <AllPistasModal
        isOpen={showAllPistasModal}
        onClose={() => setShowAllPistasModal(false)}
        pistas={spots}
        onPistaClick={handlePistaClick}
      />
      
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000 
      }}>
        <AddButton 
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <FaPlus size={14} />
          Solicitar Pista
        </AddButton>
      </div>
    </PageContainer>
  );
};

export default Map;
