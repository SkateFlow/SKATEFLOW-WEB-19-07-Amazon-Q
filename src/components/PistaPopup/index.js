import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaGlobe, FaLock, FaChevronLeft, FaChevronRight, FaSkating } from 'react-icons/fa';

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
  border-radius: 20px;
  padding: 0;
  max-width: 480px;
  width: 90%;
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
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 16px;
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
  width: 44px;
  height: 44px;
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
  left: 16px;
  
  &:hover svg {
    transform: translateX(-2px);
  }
`;

const NextButton = styled(CarouselButton)`
  right: 16px;
  
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

const PistaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const PistaTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
  line-height: 1.2;
  flex: 1;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.publica ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.publica ? '#166534' : '#92400e'};
  white-space: nowrap;
`;

const PistaDescription = styled.p`
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1f2937;
`;

const InfoIcon = styled.div`
  color: #1a237e;
  display: flex;
  align-items: center;
  min-width: 20px;
`;

const InfoText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
`;

const CoordinatesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const CoordinateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const CoordinateLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const CoordinateValue = styled.span`
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  font-family: monospace;
`;

const PistaCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images.filter(img => img && img.trim() !== '');
  const displayImages = validImages.length > 0 ? validImages : ['https://via.placeholder.com/480x220/667eea/ffffff?text=🛹+Pista+de+Skate'];

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselTrack currentIndex={currentIndex}>
        {displayImages.map((image, index) => (
          <ImageContainer key={index}>
            <CarouselImage
              src={image}
              alt={`Pista image ${index + 1}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/480x220/667eea/ffffff?text=🛹+Erro+ao+Carregar';
              }}
            />
            <ImageOverlay />
          </ImageContainer>
        ))}
      </CarouselTrack>
      
      {displayImages.length > 1 && (
        <>
          <PrevButton onClick={goToPrevious}>
            <FaChevronLeft size={18} />
          </PrevButton>
          
          <NextButton onClick={goToNext}>
            <FaChevronRight size={18} />
          </NextButton>
          
          <DotsContainer>
            {displayImages.map((_, index) => (
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

const PistaPopup = ({ pista, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  
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
          <PistaCarousel images={pista.foto ? [`data:image/jpeg;base64,${pista.foto}`] : pista.images || []} />
          
          <PistaHeader>
            <PistaTitle>{pista.nome || pista.name}</PistaTitle>
            <StatusBadge publica={pista.tipo === 'Pública' || pista.publica}>
              {(pista.tipo === 'Pública' || pista.publica) ? <FaGlobe size={12} /> : <FaLock size={12} />}
              {pista.tipo || (pista.publica ? 'Pública' : 'Privada')}
            </StatusBadge>
          </PistaHeader>
          
          <PistaDescription>{pista.descricao || pista.description}</PistaDescription>
          
          <InfoSection>
            <InfoRow>
              <InfoIcon><FaMapMarkerAlt size={18} /></InfoIcon>
              <InfoText>{pista.endereco || pista.location || `${pista.rua || ''}, ${pista.numero || ''} - ${pista.bairro || ''}`}</InfoText>
            </InfoRow>
            {pista.valor && (
              <InfoRow>
                <InfoIcon><FaSkating size={18} /></InfoIcon>
                <InfoText>Valor: R$ {pista.valor}</InfoText>
              </InfoRow>
            )}
            {pista.statusPista && (
              <InfoRow>
                <InfoIcon>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: pista.statusPista === 'ativada' ? '#10b981' : '#ef4444'
                  }} />
                </InfoIcon>
                <InfoText>Status: {pista.statusPista}</InfoText>
              </InfoRow>
            )}
          </InfoSection>

          {(pista.latitude && pista.longitude) && (
            <CoordinatesRow>
              <CoordinateItem>
                <CoordinateLabel>Latitude</CoordinateLabel>
                <CoordinateValue>{parseFloat(pista.latitude).toFixed(6)}</CoordinateValue>
              </CoordinateItem>
              <CoordinateItem>
                <CoordinateLabel>Longitude</CoordinateLabel>
                <CoordinateValue>{parseFloat(pista.longitude).toFixed(6)}</CoordinateValue>
              </CoordinateItem>
            </CoordinatesRow>
          )}
        </PopupBody>
      </PopupContent>
    </PopupOverlay>
  );
};

export default PistaPopup;