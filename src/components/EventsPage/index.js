import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { getEvents } from '../../services/eventService';
import EventPopup from '../EventPopup';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import placeholderImage from '../../assets/images/ph.svg';

// Estilização do container principal da página de eventos
const EventsContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7fafc;
  padding: 100px 0 20px;
  color: #1a202c;
  overflow-y: auto;

  h1 {
    margin-top: 20px;
    margin-bottom: 30px;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 0 160px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 24px 20px 24px ${props => props.shouldCenter ? '20px' : '0px'};
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  justify-content: ${props => props.shouldCenter ? 'center' : 'flex-start'};
  transition: transform 0.3s linear;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    overflow-x: visible;
    padding: 20px;
    justify-content: center;
  }
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #242424ff;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  &:hover {
    background: #363636ff;
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const PrevButton = styled(NavButton)`
  left: 170px;
`;

const NextButton = styled(NavButton)`
  right: 170px;
`;

const CarouselCard = styled.div`
  min-width: 300px;
  width: 300px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s linear;
  cursor: pointer;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    min-width: unset;
    margin: 0 auto;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
  color: #000000ff;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a202c;
  flex: 1;
`;

const Badge = styled.span`
  background: #2f53d8ff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 8px;
`;

const CardDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BadgeOutline = styled.span`
  border: 1px solid #4a5568;
  color: #4a5568;
  background: transparent;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 400;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 30px;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 16px;
  border: 2px solid #cbd5e0;
  border-radius: 25px;
  background: #ffffff;
  color: #2d3748;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3182ce;
  }

  &::placeholder {
    color: #4a5568;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a5568;
  pointer-events: none;
`;

const ViewMoreButton = styled.button`
  background: #253d8f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #1e3a8a;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PopupContent = styled.div`
  background: #1D1E21;
  border-radius: 12px;
  padding: 20px;
  width: 95vw;
  height: 90vh;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: white;
`;

const CloseButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #ff6666;
  }
`;

const PopupGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const SectionLabel = styled.h3`
  color: #1a202c;
  font-size: 14px;
  font-weight: 400;
  margin: 0 0 5px 0;
  text-align: left;
  width: 100%;
  padding-left: 160px;
  
  @media (max-width: 768px) {
    padding-left: 20px;
  }
`;

const ScrollBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: transparent;
  border-radius: 3px;
  margin-top: 10px;
  padding: 0 160px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ScrollBar = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #e2e8f0;
  border-radius: 3px;
  user-select: none;
`;

const ScrollThumb = styled.div`
  height: 100%;
  background: #4a5568;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s linear;
  user-select: none;
  
  &:hover {
    background: #2d3748;
  }
`;



const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);
  const scrollBarRef = useRef(null);
  
  const [events, setEvents] = useState([
    {
      id: 1,
      nomeEvento: 'Campeonato de Skate',
      dataEvento: '2025-08-20',
      localEvento: 'Praça Central',
      descricao: 'Competição para amadores e profissionais.',
      imagemEvento: placeholderImage,
    },
    {
      id: 2,
      nomeEvento: 'Best Trick Session',
      dataEvento: '2025-08-25',
      localEvento: 'Skate Park Leste',
      descricao: 'Sessão aberta com prêmios para melhores manobras.',
      imagemEvento: placeholderImage,
    },
    {
      id: 3,
      nomeEvento: 'Encontro de Skatistas',
      dataEvento: '2025-08-30',
      localEvento: 'Pista do Centro',
      descricao: 'Confraternização com DJs e food trucks.',
      imagemEvento: placeholderImage,
    },
    {
      id: 4,
      nomeEvento: 'Noite do Ollie Alto',
      dataEvento: '2025-09-05',
      localEvento: 'Skate Park Norte',
      descricao: 'Quem consegue o ollie mais alto leva o troféu!',
      imagemEvento: placeholderImage,
    },
    {
      id: 5,
      nomeEvento: 'Workshop de Manobras',
      dataEvento: '2025-09-10',
      localEvento: 'Skate Park Sul',
      descricao: 'Aprenda novas manobras com profissionais.',
      imagemEvento: placeholderImage,
    },
    {
      id: 6,
      nomeEvento: 'Competição Street',
      dataEvento: '2025-09-15',
      localEvento: 'Centro da Cidade',
      descricao: 'Competição de street skating urbano.',
      imagemEvento: placeholderImage,
    },
    {
      id: 7,
      nomeEvento: 'Festival de Skate',
      dataEvento: '2025-09-20',
      localEvento: 'Parque Municipal',
      descricao: 'Festival com música, comida e muito skate!',
      imagemEvento: placeholderImage,
    },
  ]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchEvents();
    window.scrollTo(0, 0);
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      console.log('Eventos carregados:', data);
      if (data && data.length > 0) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const handleViewDetails = (event) => {
    console.log('Abrindo modal para evento:', encodeURIComponent(JSON.stringify(event)));
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  const updateScrollPosition = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const position = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollPosition(position);
    }
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    
    if (!scrollBarRef.current || !carouselRef.current) return;
    
    const rect = scrollBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    const { scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScrollLeft = (percentage / 100) * maxScroll;
    
    // Smooth animation only on initial click
    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
    
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    if (!scrollBarRef.current || !carouselRef.current) return;
    
    const rect = scrollBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    const { scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const scrollLeft = (percentage / 100) * maxScroll;
    
    // Instant movement when dragging
    carouselRef.current.scrollLeft = scrollLeft;
    setScrollPosition(percentage);
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('selectstart', (e) => e.preventDefault());
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('selectstart', (e) => e.preventDefault());
      };
    }
  }, [isDragging, handleMouseMove]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollPosition);
      updateScrollPosition();
      return () => carousel.removeEventListener('scroll', updateScrollPosition);
    }
  }, [updateScrollPosition]);



  const scrollLeft = () => {
    const scrollAmount = 200;
    carouselRef.current?.scrollBy({ 
      left: -scrollAmount, 
      behavior: 'smooth' 
    });
  };

  const scrollRight = () => {
    const scrollAmount = 200;
    carouselRef.current?.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
  };



  const filteredEvents = events.filter(event =>
    event.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.localEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shouldCenterEvents = filteredEvents.length <= 3;
  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.dataEvento) - new Date(a.dataEvento));
  const displayedEvents = window.innerWidth <= 768 ? sortedEvents.slice(0, 3) : filteredEvents;
  
  const handleShowAllEvents = () => {
    setShowAllEvents(true);
  };
  
  const handleClosePopup = () => {
    setShowAllEvents(false);
  };

  return (
    <>
      <style>
        {`
          nav {
            background: #f7fafc !important;
          }
        `}
      </style>
      <Sidebar isOpen={isOpen} toggle={toggle}/>
      <Navbar toggle={toggle} scrollNav={true}/>
      <EventsContainer>
        <h1>Eventos</h1>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Pesquisar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
        </SearchContainer>
        <SectionLabel>Recentes</SectionLabel>
        <CarouselWrapper>
          {!shouldCenterEvents && (
            <PrevButton onClick={scrollLeft}>
              <FaChevronLeft />
            </PrevButton>
          )}
          <CarouselContainer ref={carouselRef} shouldCenter={shouldCenterEvents}>
            {displayedEvents.map((event) => (
              <CarouselCard key={event.id} onClick={() => handleViewDetails(event)}>
                <CardImage 
                  src={event.imagemEvento || placeholderImage} 
                  alt={event.nomeEvento}
                />
                <CardContent>
                  <CardHeader>
                    <CardTitle>{event.nomeEvento}</CardTitle>
                    <Badge>NOVO</Badge>
                  </CardHeader>
                  <CardDescription>{event.descricao}</CardDescription>
                  <CardActions>
                    <BadgeOutline>{event.dataEvento}</BadgeOutline>
                    <BadgeOutline>{event.localEvento}</BadgeOutline>
                  </CardActions>
                </CardContent>
              </CarouselCard>
            ))}
          </CarouselContainer>
          {!shouldCenterEvents && (
            <NextButton onClick={scrollRight}>
              <FaChevronRight />
            </NextButton>
          )}
        </CarouselWrapper>
        
        {!shouldCenterEvents && (
          <ScrollBarContainer>
            <ScrollBar ref={scrollBarRef} onMouseDown={handleMouseDown}>
              <ScrollThumb 
                style={{
                  width: `${Math.max(10, 100 / Math.max(1, displayedEvents.length / 3))}%`,
                  transform: `translateX(${scrollPosition * (100 / Math.max(10, 100 / Math.max(1, displayedEvents.length / 3)) - 1)}%)`
                }}
              />
            </ScrollBar>
          </ScrollBarContainer>
        )}
        
        <ViewMoreButton onClick={handleShowAllEvents}>
          Ver mais eventos
        </ViewMoreButton>

        {showAllEvents && (
          <PopupOverlay onClick={handleClosePopup}>
            <PopupContent onClick={(e) => e.stopPropagation()}>
              <PopupHeader>
                <h2>Todos os Eventos</h2>
                <CloseButton onClick={handleClosePopup}>×</CloseButton>
              </PopupHeader>
              <PopupGrid>
                {filteredEvents.map((event) => (
                  <CarouselCard key={event.id} onClick={() => handleViewDetails(event)}>
                    <CardImage 
                      src={event.imagemEvento || placeholderImage} 
                      alt={event.nomeEvento}
                    />
                    <CardContent>
                      <CardHeader>
                        <CardTitle>{event.nomeEvento}</CardTitle>
                        <Badge>NOVO</Badge>
                      </CardHeader>
                      <CardDescription>{event.descricao}</CardDescription>
                      <CardActions>
                        <BadgeOutline>{event.dataEvento}</BadgeOutline>
                        <BadgeOutline>{event.localEvento}</BadgeOutline>
                      </CardActions>
                    </CardContent>
                  </CarouselCard>
                ))}
              </PopupGrid>
            </PopupContent>
          </PopupOverlay>
        )}

        {selectedEvent && (
          <EventPopup event={selectedEvent} onClose={closeDetails} />
        )}
      </EventsContainer>
    </>
  );
};

export default EventsPage;