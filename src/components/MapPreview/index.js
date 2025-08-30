import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import styled from 'styled-components';
import mapPreview from '../../assets/images/MapExemple.png';

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.2);
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  filter: blur(4px);
  transition: all 0.3s ease;
  
  ${MapContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  
  ${MapContainer}:hover & {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 24px;
`;

const IconContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
  
  ${MapContainer}:hover & {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const Icon = styled(FaMapMarkerAlt)`
  width: 48px;
  height: 48px;
  color: #3b82f6;
  transition: transform 0.3s ease;
  
  ${MapContainer}:hover & {
    transform: scale(1.1);
  }
`;

const ContentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 12px;
`;

const ContentDescription = styled.p`
  color: #666;
  margin-bottom: 24px;
  max-width: 400px;
`;

const Button = styled.button`
  background: #043C70;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }
`;

const MapPreview = () => {
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate('/map');
  };

  return (
    <Container>
      <Header>
        <Title>Localização das Pistas</Title>
        <Description>
          Veja onde estão localizadas todas as nossas pistas
        </Description>
      </Header>
      
      <MapContainer onClick={handleMapClick}>
        <BackgroundImage src={mapPreview} />
        <Overlay />
        
        <Content>
          <IconContainer>
            <Icon />
          </IconContainer>
          
          <ContentTitle>
            Clique para visualizar o mapa completo
          </ContentTitle>
          
          <ContentDescription>
            Explore todas as localizações, rotas e detalhes das pistas em nosso mapa interativo
          </ContentDescription>
          
          <Button>
            Abrir Mapa Interativo
          </Button>
        </Content>
      </MapContainer>
    </Container>
  );
};

export default MapPreview;