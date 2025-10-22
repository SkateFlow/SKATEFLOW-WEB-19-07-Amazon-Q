import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import placeholderImage from '../../assets/images/ph.svg';
import { eventoService } from '../../services/eventService';
import {
  EventsHeroContainer,
  EventsHeroContent,
  ContentGrid,
  TextContent,
  Title,
  Subtitle,
  Description,
  ButtonContainer,
  ExploreButton,
  StatsContainer,
  StatItem,
  StatNumber,
  StatLabel,
  EventCard,
  ImageContainer,
  HeroImage,
  OverlayCard,
  CardTitle,
  EventInfo,
  EventDetail,
  ViewButton,
  DecorativeElement,
  CarouselButton,
  CarouselDots,
  Dot
} from './EventsHeroElements';

const EventsHeroSection = () => {
  const [eventos, setEventos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventoService.listar();
        const eventosPublicados = data.filter(e => e.statusEvento === 'Publicado').slice(0, 3);
        setEventos(eventosPublicados);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };
    fetchEventos();
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % eventos.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + eventos.length) % eventos.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleVerDetalhes = (eventoId) => {
    navigate('/events', { state: { eventoId } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const currentEvento = eventos[currentIndex];

  return (
    <EventsHeroContainer id="events-hero">
      <EventsHeroContent>
        <ContentGrid>
          <TextContent>
            <div>
              <Title>
                Descubra os Melhores
                <Subtitle>Eventos de Skate</Subtitle>
              </Title>
              
              <Description>
                Encontre competições, workshops e encontros de skate na sua região. 
                Conecte-se com a comunidade e viva a cultura do skateboard.
              </Description>
            </div>

            <ButtonContainer>
              <ExploreButton as={Link} to="/events">
                Explorar Eventos
                <FaArrowRight />
              </ExploreButton>
            </ButtonContainer>


          </TextContent>

          {eventos.length > 0 && (
            <EventCard id="CardEvent" onClick={() => handleVerDetalhes(currentEvento.id)}>
              <ImageContainer>
                <HeroImage 
                  src={currentEvento.foto1 ? `data:image/jpeg;base64,${currentEvento.foto1}` : placeholderImage} 
                  alt={currentEvento.nome}
                  style={{ opacity: isTransitioning ? 0 : 1 }}
                />
                
                <OverlayCard>
                  <CardTitle>{currentEvento.nome}</CardTitle>
                  
                  <EventInfo>
                    <EventDetail>
                      <FaCalendarAlt />
                      <span>{formatDate(currentEvento.dataInicio)}</span>
                    </EventDetail>
                    
                    <EventDetail>
                      <FaMapMarkerAlt />
                      <span>{currentEvento.lugar_id?.nome || 'Local não informado'}</span>
                    </EventDetail>
                  </EventInfo>
                  
                  <ViewButton onClick={(e) => { e.stopPropagation(); handleVerDetalhes(currentEvento.id); }}>Ver Detalhes</ViewButton>
                </OverlayCard>

                {eventos.length > 1 && (
                  <>
                    <CarouselButton className="prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
                      <FaChevronLeft />
                    </CarouselButton>
                    <CarouselButton className="next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
                      <FaChevronRight />
                    </CarouselButton>
                    <CarouselDots>
                      {eventos.map((_, index) => (
                        <Dot key={index} active={index === currentIndex} onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }} />
                      ))}
                    </CarouselDots>
                  </>
                )}

                <DecorativeElement className="top" />
                <DecorativeElement className="bottom" />
              </ImageContainer>
            </EventCard>
          )}
        </ContentGrid>
      </EventsHeroContent>
    </EventsHeroContainer>
  );
};

export default EventsHeroSection;