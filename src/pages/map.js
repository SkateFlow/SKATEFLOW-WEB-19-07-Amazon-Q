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
import { lugarService } from '../services/lugarService';
import { cepService } from '../services/cepService';
import { avaliacaoService } from '../services/avaliacaoService';
import { categoriaService } from '../services/categoriaService';
import { usePistasPendentes } from '../hooks/usePistasPendentes';
import { memoryOptimizer } from '../utils/memoryOptimizer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  position: relative;
  
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

const RatingBadge = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
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
  const { adicionarPistaPendente } = usePistasPendentes();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
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
      memoryOptimizer.clearImageCache();
    };
  }, []);

  useEffect(() => {
    loadSkateParks();
    loadLugares();
    loadCategorias();
    initializeMap();
    
    // Adicionar estilos personalizados para os pop-ups do mapa
    if (!document.getElementById('map-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'map-popup-styles';
      style.textContent = `
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const initializeMap = () => {
    const mapContainer = document.getElementById('map');
    if (mapContainer && !mapContainer._leaflet_id && window.L) {
      const map = window.L.map('map').setView([-23.5505, -46.6333], 13);
      
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      setMapInstance(map);
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadLugares = async () => {
    try {
      const data = await lugarService.listar();
      // Filtrar apenas pistas ativadas
      const lugaresAtivos = data.filter(lugar => lugar.statusPista === 'ativada');
      
      const lugaresProcessados = await Promise.all(
        lugaresAtivos.map(async (lugar) => {
          let lugarAtualizado = { ...lugar, fotosCarregadas: false };
          
          // Se não tem rua/bairro mas tem CEP, buscar endereço
          if ((!lugar.rua || !lugar.bairro) && lugar.cep) {
            try {
              const endereco = await cepService.buscarEnderecoPorCep(lugar.cep);
              lugarAtualizado.rua = endereco.logradouro;
              lugarAtualizado.bairro = endereco.bairro;
              
              // Se não tem coordenadas, buscar também
              if (!lugar.latitude || !lugar.longitude) {
                const coordenadas = await cepService.obterCoordenadas(
                  `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade}, ${endereco.uf}`
                );
                lugarAtualizado.latitude = coordenadas.latitude.toString();
                lugarAtualizado.longitude = coordenadas.longitude.toString();
              }
            } catch (error) {
              console.error('Erro ao buscar endereço para:', lugar.nome, error);
            }
          }
          
          // Carregar média de avaliações
          try {
            const media = await avaliacaoService.buscarMedia(lugar.id);
            lugarAtualizado.mediaAvaliacoes = media || 0;
          } catch (error) {
            lugarAtualizado.mediaAvaliacoes = 0;
          }
          
          return lugarAtualizado;
        })
      );
      
      setLugares(lugaresProcessados);
      
      // Carregar fotos de forma assíncrona
      lugaresProcessados.forEach(async (lugar, index) => {
        try {
          const foto1 = await lugarService.buscarFoto1(lugar.id);
          if (foto1) {
            setLugares(prev => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                foto1Base64: `data:image/jpeg;base64,${foto1}`
              };
              return updated;
            });
          }
        } catch (error) {}
      });
    } catch (error) {
      console.error('Erro ao carregar lugares:', error);
    }
  };

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
    adicionarPistaPendente(newPista);
  };

  const handlePistaClick = async (pista) => {
    // Carregar fotos apenas quando necessário
    if (!pista.fotosCarregadas && pista.id) {
      const fotos = [];
      
      const loadFoto = async (fotoNum) => {
        try {
          const foto = await lugarService[`buscarFoto${fotoNum}`](pista.id);
          if (foto) fotos.push(`data:image/jpeg;base64,${foto}`);
        } catch (error) {}
      };
      
      await Promise.all([loadFoto(1), loadFoto(2), loadFoto(3)]);
      
      pista.fotos = fotos;
      pista.fotosCarregadas = true;
    }
    
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

  const filteredLugares = lugares.filter(lugar => {
    const matchesSearch = lugar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lugar.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lugar.rua || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lugar.bairro || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lugar.cep || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'todos' || 
                       (lugar.categoria?.nome && lugar.categoria.nome.toLowerCase() === typeFilter);
    return matchesSearch && matchesType;
  });

  // Adicionar marcadores no mapa quando lugares são carregados
  useEffect(() => {
    if (mapInstance && lugares.length > 0) {
      // Limpar marcadores existentes
      mapInstance.eachLayer(layer => {
        if (layer instanceof window.L.Marker) {
          mapInstance.removeLayer(layer);
        }
      });
      
      lugares.forEach(lugar => {
        if (lugar.latitude && lugar.longitude) {
          const enderecoCompleto = lugar.rua && lugar.bairro 
            ? `${lugar.rua}${lugar.numero ? `, ${lugar.numero}` : ''} - ${lugar.bairro}`
            : `CEP: ${lugar.cep || 'Endereço não disponível'}`;
          
          const marker = window.L.marker([parseFloat(lugar.latitude), parseFloat(lugar.longitude)])
            .addTo(mapInstance)
            .bindTooltip(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #1a237e; font-size: 16px;">${lugar.nome}</h3>
                <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">${lugar.descricao}</p>
                <div style="margin-bottom: 8px;">
                  <span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">${lugar.categoria?.nome || 'Categoria não informada'}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="color: #64748b; font-size: 12px;">👤 ${(lugar.usuario?.nome || 'Usuário não informado').replace(/0$/, '')}</span>
                </div>
                <small style="color: #64748b;">📍 ${enderecoCompleto}</small>
              </div>
            `, {
              permanent: false,
              direction: 'top',
              offset: [0, -10],
              className: 'custom-popup'
            })
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #1a237e; font-size: 16px;">${lugar.nome}</h3>
                <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">${lugar.descricao}</p>
                <div style="margin-bottom: 8px;">
                  <span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">${lugar.categoria?.nome || 'Categoria não informada'}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="color: #64748b; font-size: 12px;">👤 ${(lugar.usuario?.nome || 'Usuário não informado').replace(/0$/, '')}</span>
                </div>
                <small style="color: #64748b;">📍 ${enderecoCompleto}</small>
              </div>
            `, {
              maxWidth: 300,
              className: 'custom-popup'
            });
          
          marker.on('click', () => handlePistaClick(lugar));
        }
      });
    }
  }, [mapInstance, lugares]);

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
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                }}
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
                    {type === 'todos' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </FilterBadge>
                ))}
              </FilterBadges>
              

            </FiltersContainer>
          </Header>
          
          <SpotsList>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#4a5568' }}>
                Carregando pistas...
              </div>
            ) : (
              <>
                {/* Lugares registrados */}
                {filteredLugares.length > 0 && (
                  <>
                    {filteredLugares.map(lugar => (
                      <SpotCard
                        key={`lugar-${lugar.id}`}
                        isSelected={selectedSpot?.id === lugar.id}
                        onClick={() => handlePistaClick(lugar)}
                      >

                        
                        {lugar.foto1Base64 ? (
                          <SpotImage 
                            src={lugar.foto1Base64} 
                            alt={lugar.nome}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '120px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                            fontSize: '14px',
                            marginBottom: '12px'
                          }}>
                            🛹 {lugar.nome}
                          </div>
                        )}
                        <SpotName>{lugar.nome}</SpotName>
                        <SpotDescription>{lugar.descricao}</SpotDescription>
                        <SpotLocation>
                          <FaMapMarkerAlt />
                          <span>
                            {lugar.rua && lugar.bairro 
                              ? `${lugar.rua}${lugar.numero ? `, ${lugar.numero}` : ''} - ${lugar.bairro}`
                              : lugar.endereco || lugar.localizacao || lugar.cep || 'Localização não informada'
                            }
                          </span>
                        </SpotLocation>
                        <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '12px', fontWeight: '600', marginRight: '8px' }}>
                            {lugar.categoria?.nome || 'Categoria não informada'}
                          </span>
                          <span style={{ color: '#64748b' }}>
                            👤 {(lugar.usuario?.nome || 'Usuário não informado').replace(/0$/, '')}
                          </span>
                        </div>
                        <SpotStats>
                          <StatItem>
                            <span style={{ color: '#4a5568', fontSize: '12px' }}>
                              {lugar.tipo}{lugar.tipo === 'Privada' && lugar.valor > 0 ? ` - R$ ${lugar.valor}` : ''}
                            </span>
                          </StatItem>
                          <StatItem>
                            <FaStar color="#fbbf24" size={14} />
                            <span style={{ color: '#4a5568', fontWeight: '600' }}>
                              {lugar.mediaAvaliacoes > 0 ? lugar.mediaAvaliacoes.toFixed(1) : 'S/A'}
                            </span>
                          </StatItem>
                        </SpotStats>
                      </SpotCard>
                    ))}
                  </>
                )}
                
                {/* Pistas do serviço original */}
                {filteredSpots.length > 0 && (
                  <>
                    <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: '0 0 8px 0' }}>
                        Outras Pistas ({filteredSpots.length})
                      </h3>
                    </div>
                    {filteredSpots.map(spot => (
                      <SpotCard
                        key={`spot-${spot.id}`}
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
                    ))}
                  </>
                )}
                
                {filteredLugares.length === 0 && filteredSpots.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#4a5568' }}>
                    Nenhuma pista encontrada com os filtros aplicados.
                  </div>
                )}
              </>
            )}
          </SpotsList>
          
          <FooterStats>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{filteredLugares.length + filteredSpots.length} de {lugares.length + spots.length} pistas encontradas</span>
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
        lugares={lugares}
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
          onClick={() => {
            if (isAuthenticated) {
              setIsCreateModalOpen(true);
            } else {
              localStorage.setItem('login_message', 'Você precisa estar logado para solicitar uma pista.');
              navigate('/login');
            }
          }}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <FaPlus size={14} />
          {user?.nivelAcesso === 'ADMIN' || user?.isOrganizador ? 'Criar Pista' : 'Solicitar Pista'}
        </AddButton>
      </div>
    </PageContainer>
  );
};

export default Map;
