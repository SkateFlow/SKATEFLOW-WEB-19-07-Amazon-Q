import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import placeholderImage from '../../assets/images/ph.svg';
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
  DecorativeElement
} from './EventsHeroElements';

const EventsHeroSection = () => {
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

            <StatsContainer>
              <StatItem>
                <StatNumber>150+</StatNumber>
                <StatLabel>Eventos Ativos</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>2.5k</StatNumber>
                <StatLabel>Participantes</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>25</StatNumber>
                <StatLabel>Cidades</StatLabel>
              </StatItem>
            </StatsContainer>
          </TextContent>

          <EventCard id="CardEvent">
            <ImageContainer>
              <HeroImage src={placeholderImage} alt="Evento de Skateboard" />
              
              <OverlayCard>
                <CardTitle>Próximo Evento em Destaque</CardTitle>
                
                <EventInfo>
                  <EventDetail>
                    <FaCalendarAlt />
                    <span>15 de Setembro, 2024</span>
                  </EventDetail>
                  
                  <EventDetail>
                    <FaMapMarkerAlt />
                    <span>Skate Park Central, São Paulo</span>
                  </EventDetail>
                </EventInfo>
                
                <ViewButton>Ver Detalhes</ViewButton>
              </OverlayCard>

              <DecorativeElement className="top" />
              <DecorativeElement className="bottom" />
            </ImageContainer>
          </EventCard>
        </ContentGrid>
      </EventsHeroContent>
    </EventsHeroContainer>
  );
};

export default EventsHeroSection;