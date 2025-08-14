
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBars, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { getEvents } from '../../services/eventService';
import EventDetails from '../../components/EventsPage/EventsDetails';
import placeholderImage from '../../assets/images/ph.svg';



// Navbar customizada com background sempre transparente
const TransparentNav = styled.nav`
  background: #1D1E21;
  height: 80px;
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1100px;
`;

const NavLogo = styled(Link)`
  color: #fff;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-left: 24px;
  font-weight: bold;
  text-decoration: none;
`;

const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  height: 80px;
`;

const NavLinks = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  transition: border-bottom 0.2s ease-in-out;

  &:hover {
    border-bottom: 3px solid #043C70;
  }

  &.active {
    border-bottom: 3px solid #043C70;
  }
`;

const NavBtn = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: rgba(0, 0, 0, 0.9);
  z-index: 999;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;

  @media screen and (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  }
`;

const MobileNavItem = styled.div`
  padding: 20px 0;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #333;
`;

const MobileNavLink = styled(Link)`
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
  
  &:hover {
    color: #043C70;
  }
`;

const NavBtnLink = styled(Link)`
  border-radius: 50px;
  background: #043C70;
  white-space: nowrap;
  padding: 10px 22px;
  color: #C0C0C0;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;

// Estilização do container principal da página de eventos
const EventsContainer = styled.div`
  height: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1D1E21;
  padding: 20px 0;
  color: white;
  margin-top:-80px;
  overflow-y: auto;

  h1 {
    margin-top: 100px;
    margin-bottom: 30px;
  }
`;


const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 0 30px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 24px 20px 24px ${props => props.shouldCenter ? '20px' : '80px'};
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  justify-content: ${props => props.shouldCenter ? 'center' : 'flex-start'};
  
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
  background: #2e2e2eff;
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
  left: 10px;
`;

const NextButton = styled(NavButton)`
  right: 10px;
`;


const CarouselCard = styled.div`
  min-width: 300px;
  width: 300px;
  background: #424242ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  scroll-snap-align: start;
  cursor: pointer;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    min-width: unset;
    margin: 0 auto;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
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
  color: #ffffffff;
  flex: 1;
`;

const Badge = styled.span`
  background: #253d8fff;
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
  color: #ffffffff;
  line-height: 1.4;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BadgeOutline = styled.span`
  border: 1px solid #ffffffff;
  color: #ffffffff;
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
  border: 2px solid #424242;
  border-radius: 25px;
  background: #2e2e2e;
  color: white;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #253d8f;
  }

  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
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
  color: white;
  font-size: 14px;
  font-weight: 400;
  margin: 0 0 5px 0;
  text-align: left;
  width: 100%;
  padding-left: 30px;
  
  @media (max-width: 768px) {
    padding-left: 20px;
  }
`;

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const carouselRef = useRef(null);
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
  }, {
    id: 5,
    nomeEvento: 'Noite do Ollie Alto',
    dataEvento: '2025-09-05',
    localEvento: 'Skate Park Norte',
    descricao: 'Quem consegue o ollie mais alto leva o troféu!',
    imagemEvento: placeholderImage,
  }, {
    id: 6,
    nomeEvento: 'Noite do Ollie Alto',
    dataEvento: '2025-09-05',
    localEvento: 'Skate Park Norte',
    descricao: 'Quem consegue o ollie mais alto leva o troféu!',
    imagemEvento: placeholderImage,
  }, {
    id: 7,
    nomeEvento: 'Noite do Ollie Alto',
    dataEvento: '2025-09-05',
    localEvento: 'Skate Park Norte',
    descricao: 'Quem consegue o ollie mais alto leva o troféu!',
    imagemEvento: placeholderImage,
  },
]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // Efeito para buscar eventos ao carregar o componente
  useEffect(() => {
    fetchEvents();
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


  // Função para lidar com a exclusão de eventos
  // const handleDelete = async (id) => {
  //   await deleteEvent(id);
  //   fetchEvents();
  // };

  const handleViewDetails = (event) => {
    console.log('Abrindo modal para evento:', event);
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  const scrollLeft = () => {
    const cardWidth = 324; // 300px width + 24px gap
    carouselRef.current?.scrollBy({ 
      left: -cardWidth, 
      behavior: 'smooth' 
    });
  };

  const scrollRight = () => {
    const cardWidth = 324; // 300px width + 24px gap
    carouselRef.current?.scrollBy({ 
      left: cardWidth, 
      behavior: 'smooth' 
    });
  };

  const filteredEvents = events.filter(event =>
    event.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.localEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shouldCenterEvents = filteredEvents.length <= 3;
  // Ordenar eventos por data (mais recentes primeiro) e limitar a 3 no mobile
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
      <TransparentNav>
        <NavbarContainer>
          <NavLogo to="/">SkateFlow</NavLogo>
          <MobileIcon onClick={toggle}>
            <FaBars />
          </MobileIcon>
          <NavMenu>
            <NavItem>
              <NavLinks to="/">Home</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="/events">Eventos</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="/map">Mapa</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="/articles">Artigos</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="https://www.example.com">Mobile</NavLinks>
            </NavItem>
          </NavMenu>
          <NavBtn>
            <NavBtnLink to="/login">Login</NavBtnLink>
          </NavBtn>
        </NavbarContainer>
      </TransparentNav>
      
      <MobileMenu isOpen={isOpen}>
        <MobileNavItem>
          <MobileNavLink to="/" onClick={toggle}>Home</MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink to="/events" onClick={toggle}>Eventos</MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink to="/map" onClick={toggle}>Mapa</MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink to="/articles" onClick={toggle}>Artigos</MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink to="https://www.example.com" onClick={toggle}>Mobile</MobileNavLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileNavLink to="/login" onClick={toggle}>Login</MobileNavLink>
        </MobileNavItem>
      </MobileMenu>
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
          <div>
            <p>Modal deveria aparecer aqui</p>
            <EventDetails event={selectedEvent} onClose={closeDetails} />
          </div>
        )}
      </EventsContainer>
    </>
  );
};

export default EventsPage;