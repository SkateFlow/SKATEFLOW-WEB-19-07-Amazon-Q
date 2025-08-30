import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import { fetchSkateParks } from '../services/skateParksService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
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
  background: #f8f9fa;
  border-right: 1px solid #e2e8f0;
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
  border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1a202c;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #718096;
  margin: 0 0 16px 0;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
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
  color: #718096;
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
  color: #4a5568;
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
  border: 1px solid #e2e8f0;
  background: ${props => props.active ? '#3182ce' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#4a5568'};
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
  color: #1a202c;
  margin: 0 0 8px 0;
  font-size: 16px;
`;

const SpotDescription = styled.p`
  font-size: 14px;
  color: #718096;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const SpotLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #718096;
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
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  color: #718096;
`;



const Map = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [difficultyFilter, setDifficultyFilter] = useState('todos');
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    loadSkateParks();
  }, []);

  const loadSkateParks = async () => {
    setLoading(true);
    try {
      // Usando dados fictícios para demonstração
      const data = await fetchSkateParks();
      setSpots(data);
    } catch (error) {
      console.error('Erro ao carregar pistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const spotTypes = ['todos', 'bowl', 'street', 'park'];
  const difficulties = ['todos', 'iniciante', 'intermediário', 'avançado'];

  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'todos' || spot.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'todos' || spot.difficulty === difficultyFilter;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  return (
    <PageContainer>
      <ScrollToTop />
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} scrollNav={true} />
      
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
              
              <FilterGroup>
                <FilterLabel>Dificuldade:</FilterLabel>
              </FilterGroup>
              <FilterBadges>
                {difficulties.map(difficulty => (
                  <FilterBadge
                    key={difficulty}
                    active={difficultyFilter === difficulty}
                    onClick={() => setDifficultyFilter(difficulty)}
                  >
                    {difficulty === 'todos' ? 'Todas' : difficulty}
                  </FilterBadge>
                ))}
              </FilterBadges>
            </FiltersContainer>
          </Header>
          
          <SpotsList>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#718096' }}>
                Carregando pistas reais do Brasil...
              </div>
            ) : filteredSpots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#718096' }}>
                Nenhuma pista encontrada com os filtros aplicados.
              </div>
            ) : (
              filteredSpots.map(spot => (
                <SpotCard
                  key={spot.id}
                  isSelected={selectedSpot?.id === spot.id}
                  onClick={() => setSelectedSpot(spot)}
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
                      <span>{spot.rating}</span>
                    </StatItem>
                    <StatItem>
                      <FaHeart color="#718096" />
                      <span>{spot.likes}</span>
                    </StatItem>
                  </SpotStats>
                </SpotCard>
              ))
            )}
          </SpotsList>
          
          <FooterStats>
            {filteredSpots.length} de {spots.length} pistas encontradas
          </FooterStats>
        </SidePanel>
        
        <MapPanel>
          <iframe
            title="Mapa de Pistas de Skate em São Paulo"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d82751.09276178555!2d-46.68219822122801!3d-23.564270587934733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1spista%20de%20skate%20s%C3%A3o%20paulo!5e0!3m2!1spt-BR!2sbr!4v1726882531768!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen=""
            loading="fast"
          />
        </MapPanel>
      </MainContent>
    </PageContainer>
  );
};

export default Map;
