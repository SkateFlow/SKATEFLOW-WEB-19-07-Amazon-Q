import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch, FiFilter, FiMapPin, FiStar, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriaService } from '../../services/categoriaService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  width: 95%;
  max-width: 1200px;
  height: 800px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
`;

const ModalTitle = styled.h2`
  color: #1a237e;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1a237e;
  }
`;

const ModalContent = styled.div`
  padding: 32px;
  height: 720px;
  overflow-y: auto;
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a237e;
  white-space: nowrap;
`;

const FilterBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterBadge = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid ${props => props.active ? '#667eea' : '#e2e8f0'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#5a67d8' : '#f8fafc'};
  }
`;

const PistasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PistaCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 280px;
  position: relative;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const PistaImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const PistaName = styled.h3`
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PistaDescription = styled.p`
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 8px 0;
  line-height: 1.4;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PistaLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 8px;
  margin-top: auto;
`;

const PistaStats = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
  color: #475569;
`;

const AllPistasModal = ({ isOpen, onClose, pistas, lugares = [], onPistaClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const spotTypes = ['todos', 'bowl', 'street', 'park'];

  // Combinar pistas originais com lugares do sistema
  const todasPistas = useMemo(() => {
    return [...lugares, ...pistas];
  }, [lugares, pistas]);

  const filteredPistas = useMemo(() => {
    return todasPistas.filter(pista => {
      const matchesSearch = 
        (pista.nome || pista.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pista.descricao || pista.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pista.localizacao || pista.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pista.rua || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pista.bairro || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pista.cep || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'todos' || 
                         (pista.type === typeFilter) || 
                         (pista.tipo && pista.tipo.toLowerCase() === typeFilter) ||
                         (pista.categoria?.nome && pista.categoria.nome.toLowerCase() === typeFilter);
      return matchesSearch && matchesType;
    });
  }, [todasPistas, searchTerm, typeFilter]);

  const handlePistaCardClick = (pista) => {
    onPistaClick(pista);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <ModalContainer 
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Todas as Pistas ({filteredPistas.length})</ModalTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <FiltersSection>
                <SearchContainer>
                  <SearchIcon />
                  <SearchInput
                    placeholder="Buscar pistas por nome, descrição ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>

                <FilterGroup>
                  <FiFilter size={14} color="#1a237e" />
                  <FilterLabel>Tipo:</FilterLabel>
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
                </FilterGroup>


              </FiltersSection>

              {filteredPistas.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🛹</EmptyIcon>
                  <EmptyText>Nenhuma pista encontrada</EmptyText>
                  <p>Tente ajustar os filtros ou termos de busca</p>
                </EmptyState>
              ) : (
                <PistasGrid>
                  {filteredPistas.map((pista) => (
                    <PistaCard 
                      key={pista.id} 
                      onClick={() => handlePistaCardClick(pista)}
                    >

                      
                      <PistaImage 
                        src={pista.images?.[0] || pista.foto1Base64 || pista.fotos?.[0] || 'https://via.placeholder.com/300x120/667eea/ffffff?text=🛹+Pista'}
                        alt={pista.nome || pista.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x120/667eea/ffffff?text=🛹+Pista';
                        }}
                      />
                      
                      <PistaName>{pista.nome || pista.name}</PistaName>
                      
                      <PistaDescription>
                        {(pista.descricao || pista.description || '').length > 80 
                          ? (pista.descricao || pista.description).substring(0, 80) + '...' 
                          : (pista.descricao || pista.description)}
                      </PistaDescription>
                      
                      <PistaLocation>
                        <FiMapPin />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {(() => {
                            const location = pista.rua && pista.bairro 
                              ? `${pista.rua}${pista.numero ? `, ${pista.numero}` : ''} - ${pista.bairro}`
                              : pista.localizacao || pista.location || 'Localização não informada';
                            return location.length > 35 ? location.substring(0, 35) + '...' : location;
                          })()} 
                        </span>
                      </PistaLocation>
                      
                      <div style={{ marginBottom: '8px', fontSize: '11px' }}>
                        <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '8px', fontWeight: '600', marginRight: '6px' }}>
                          {pista.categoria?.nome || 'Categoria'}
                        </span>
                        <span style={{ color: '#64748b' }}>
                          👤 {pista.usuario?.nome || 'Usuário'}
                        </span>
                      </div>
                      <PistaStats>
                        {pista.tipo || pista.type ? (
                          <StatItem>
                            <span style={{ color: '#4a5568', fontSize: '12px' }}>
                              {pista.tipo || pista.type}
                              {pista.valor > 0 && ` - R$ ${pista.valor}`}
                            </span>
                          </StatItem>
                        ) : (
                          <StatItem>
                            <FiHeart color="#4a5568" />
                            <span style={{ color: '#4a5568' }}>{pista.likes || '0'}</span>
                          </StatItem>
                        )}
                        <StatItem>
                          <FiStar color="#fbbf24" size={14} />
                          <span style={{ color: '#4a5568', fontWeight: '600' }}>{pista.rating || '4.0'}</span>
                        </StatItem>
                      </PistaStats>
                    </PistaCard>
                  ))}
                </PistasGrid>
              )}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AllPistasModal;