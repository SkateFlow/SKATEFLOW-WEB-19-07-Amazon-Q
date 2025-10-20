import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  animation: ${props => props.isClosing ? 'fadeOut' : 'fadeIn'} 200ms ease-in-out forwards;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const PopupContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 0;
  max-width: 600px;
  width: 90vw;
  max-height: 90vh;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: ${props => props.isClosing ? 'slideOut' : 'slideIn'} 300ms ease-in-out forwards;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
  }
`;

const InstructionText = styled.div`
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #9ca3af;
  white-space: nowrap;
`;

const PopupBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: calc(90vh - 48px);
  overflow-y: auto;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
`;

const CarouselTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 700ms ease-out;
  transform: translateX(-${props => props.currentIndex * 100}%);
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, transparent 50%, transparent 100%);
  opacity: 0;
  transition: opacity 300ms ease;
  
  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }
`;

const PrevButton = styled(CarouselButton)`
  left: 12px;
  
  &:hover svg {
    transform: translateX(-2px);
  }
`;

const NextButton = styled(CarouselButton)`
  right: 12px;
  
  &:hover svg {
    transform: translateX(2px);
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 8px 12px;
`;

const Dot = styled.button`
  border: none;
  cursor: pointer;
  transition: all 300ms ease;
  border-radius: 20px;
  background: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};
  width: ${props => props.active ? '24px' : '12px'};
  height: 12px;
  box-shadow: ${props => props.active ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
    transform: scale(1.1);
  }
`;

const EventTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
  text-align: center;
`;

const EventDescription = styled.p`
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  text-align: left;
  font-size: 15px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #1f2937;
  
  &.clickable {
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px;
    border-radius: 6px;
    
    &:hover {
      background: #f3f4f6;
      color: #1a237e;
    }
  }
`;

const InfoIcon = styled.div`
  color: #6b7280;
  display: flex;
  align-items: center;
`;

const InfoText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const DateTimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #1f2937;
`;

const DateTimeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WebsiteButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 200ms ease;
  
  &:hover {
    background: #2563eb;
  }
`;

const EventCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images.length > 0 ? images : ['https://via.placeholder.com/400x280?text=Sem+Imagem'];
  
  console.log('Carrossel recebeu imagens:', validImages);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselTrack currentIndex={currentIndex}>
        {validImages.map((image, index) => (
          <ImageContainer key={index}>
            <CarouselImage
              src={image}
              alt={`Event image ${index + 1}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x280?text=Erro+ao+Carregar';
              }}
            />
            <ImageOverlay />
          </ImageContainer>
        ))}
      </CarouselTrack>
      
      {validImages.length > 1 && (
        <>
          <PrevButton onClick={goToPrevious}>
            <FaChevronLeft size={20} />
          </PrevButton>
          
          <NextButton onClick={goToNext}>
            <FaChevronRight size={20} />
          </NextButton>
          
          <DotsContainer>
            {validImages.map((_, index) => (
              <Dot
                key={index}
                active={index === currentIndex}
                onClick={() => goToIndex(index)}
              />
            ))}
          </DotsContainer>
        </>
      )}
    </CarouselContainer>
  );
};

const EventPopup = ({ event, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  // Garantir que sempre temos imagens para exibir
  let images = [];
  if (event.fotosEvento && event.fotosEvento.length > 0) {
    images = event.fotosEvento;
  } else if (event.imagemEvento && event.imagemEvento !== 'https://via.placeholder.com/400x280?text=Sem+Imagem') {
    images = [event.imagemEvento];
  } else {
    images = ['https://via.placeholder.com/400x280?text=Sem+Imagem'];
  }
  
  console.log('Imagens do evento no popup:', images);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  return (
    <PopupOverlay onClick={handleClose} isClosing={isClosing}>
      <PopupContent onClick={(e) => e.stopPropagation()} isClosing={isClosing}>
        <InstructionText>clique fora para sair</InstructionText>
        
        <PopupBody>
          <EventCarousel images={images} />
          
          <EventTitle>{event.nomeEvento}</EventTitle>
          
          <EventDescription>{event.descricao}</EventDescription>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <InfoRow 
              className="clickable"
              onClick={() => {
                if (event.lugar_id?.id) {
                  window.location.href = `/map?pistaId=${event.lugar_id.id}`;
                } else {
                  window.location.href = '/map';
                }
              }}
              title="Clique para ver a pista"
            >
              <InfoIcon><FaMapMarkerAlt size={16} /></InfoIcon>
              <InfoText>{event.localEvento}</InfoText>
            </InfoRow>
            
            <DateTimeRow>
              <DateTimeItem>
                <InfoIcon><FaCalendarAlt size={16} /></InfoIcon>
                <InfoText>Início: {event.dataEvento}</InfoText>
              </DateTimeItem>
              <DateTimeItem>
                <InfoIcon><FaClock size={16} /></InfoIcon>
                <InfoText>{event.horaEvento || '18:00'}</InfoText>
              </DateTimeItem>
            </DateTimeRow>
            
            {event.dataFim && (
              <DateTimeRow>
                <DateTimeItem>
                  <InfoIcon><FaCalendarAlt size={16} /></InfoIcon>
                  <InfoText>Fim: {event.dataFim}</InfoText>
                </DateTimeItem>
                <DateTimeItem>
                  <InfoIcon><FaClock size={16} /></InfoIcon>
                  <InfoText>{event.horaFim || '18:00'}</InfoText>
                </DateTimeItem>
              </DateTimeRow>
            )}
            
            {event.criadoPor && (
              <InfoRow>
                <InfoIcon>👤</InfoIcon>
                <InfoText>Criado por: {event.criadoPor}</InfoText>
              </InfoRow>
            )}
            

          </div>
          
          {event.linkSite && (
              <WebsiteButton onClick={() => window.open(event.linkSite, '_blank')}>
                <span>ir ao site</span>
                <FaExternalLinkAlt size={16} />
              </WebsiteButton>
            )}
        </PopupBody>
      </PopupContent>
    </PopupOverlay>
  );
};

export default EventPopup;