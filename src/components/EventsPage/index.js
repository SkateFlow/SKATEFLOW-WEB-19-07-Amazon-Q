
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 24px 20px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
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
  background: #043C70;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  
  &:hover {
    background: #0056b3;
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
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  scroll-snap-align: start;
  cursor: pointer;
  
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
  color: #000000;
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
  color: #000000;
  flex: 1;
`;

const Badge = styled.span`
  background: #1e40af;
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
  color: #6b7280;
  line-height: 1.4;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BadgeOutline = styled.span`
  border: 1px solid #6b7280;
  color: #6b7280;
  background: transparent;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 400;
`;

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
    carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
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
        <CarouselWrapper>
          <PrevButton onClick={scrollLeft}>
            <FaChevronLeft />
          </PrevButton>
          <CarouselContainer ref={carouselRef}>
            {events.map((event) => (
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
          <NextButton onClick={scrollRight}>
            <FaChevronRight />
          </NextButton>
        </CarouselWrapper>



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