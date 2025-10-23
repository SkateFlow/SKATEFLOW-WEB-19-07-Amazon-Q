import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaGlobe, FaLock, FaChevronLeft, FaChevronRight, FaUser, FaTimes } from 'react-icons/fa';
import { convertBase64ToDataUrl } from '../utils/imageUtils';

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
  z-index: 99999;
  animation: ${props => props.isClosing ? 'fadeOut' : 'fadeIn'} 200ms ease-in-out forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const PopupContent = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 0;
  max-width: 700px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: ${props => props.isClosing ? 'slideOut' : 'slideIn'} 300ms ease-in-out forwards;
  
  @media (max-width: 768px) {
    width: 98%;
    max-height: 95vh;
    border-radius: 16px;
  }
  
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

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  z-index: 1;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
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
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const PopupBody = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 20px;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    height: 250px;
    border-radius: 12px;
  }
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

const ImageLoader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #64748b;
  font-size: 14px;
  display: ${props => props.loading ? 'block' : 'none'};
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 300ms ease;
  opacity: ${props => props.loaded ? 1 : 0};
  
  &:hover {
    transform: scale(1.02);
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  z-index: 2;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const PrevButton = styled(CarouselButton)`
  left: 16px;
`;

const NextButton = styled(CarouselButton)`
  right: 16px;
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
`;

const PistaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PistaTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
  line-height: 1.2;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ApproveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const RejectButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

const PistaCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageStates, setImageStates] = useState({});
  
  const validImages = images.filter(img => img && img.trim() !== '');
  const displayImages = validImages.length > 0 ? validImages : [
    'https://via.placeholder.com/700x350/667eea/ffffff?text=🛹+Pista+de+Skate'
  ];

  const handleImageLoad = (index) => {
    setImageStates(prev => ({ ...prev, [index]: { loaded: true, error: false } }));
  };

  const handleImageError = (index, e) => {
    setImageStates(prev => ({ ...prev, [index]: { loaded: true, error: true } }));
    e.target.src = 'https://via.placeholder.com/700x350/ef4444/ffffff?text=🛹+Erro+ao+Carregar+Imagem';
  };

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
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselTrack currentIndex={currentIndex}>
        {displayImages.map((image, index) => (
          <ImageContainer key={index}>
            {!imageStates[index]?.loaded && (
              <ImageLoader loading={true}>
                Carregando imagem...
              </ImageLoader>
            )}
            <CarouselImage
              src={image}
              alt={`Pista ${index + 1}`}
              loaded={imageStates[index]?.loaded}
              onLoad={() => handleImageLoad(index)}
              onError={(e) => handleImageError(index, e)}
            />
          </ImageContainer>
        ))}
      </CarouselTrack>
      
      {displayImages.length > 1 && (
        <>
          <PrevButton onClick={goToPrevious}>
            <FaChevronLeft size={16} />
          </PrevButton>
          
          <NextButton onClick={goToNext}>
            <FaChevronRight size={16} />
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

const SolicitacaoPistaDetailsModal = ({ isOpen, onClose, solicitacao, onApprove, onReject }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [fotosProcessadas, setFotosProcessadas] = useState([]);



  useEffect(() => {
    if (solicitacao) {
      let fotos = [];
      
      // Processa diferentes formatos de imagem
      if (solicitacao.fotos && Array.isArray(solicitacao.fotos)) {
        fotos = solicitacao.fotos.filter(foto => foto && foto.trim() !== '');
      } else if (solicitacao.imagens && Array.isArray(solicitacao.imagens)) {
        fotos = solicitacao.imagens.filter(img => img && img.trim() !== '');
      } else if (solicitacao.foto && solicitacao.foto.trim() !== '') {
        fotos = [solicitacao.foto];
      }
      
      // Converte as imagens para o formato correto
      const fotosConvertidas = fotos.map(foto => {
        try {
          if (foto.startsWith('http://') || foto.startsWith('https://')) {
            return foto;
          }
          return convertBase64ToDataUrl(foto);
        } catch (error) {
          console.warn('Erro ao processar imagem:', error);
          return 'https://via.placeholder.com/700x350/ef4444/ffffff?text=Erro+na+Imagem';
        }
      });
      
      setFotosProcessadas(fotosConvertidas);
    } else {
      setFotosProcessadas([]);
    }
  }, [solicitacao]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleApprove = () => {
    onApprove(solicitacao);
    handleClose();
  };

  const handleReject = () => {
    onReject(solicitacao);
    handleClose();
  };

  if (!isOpen || !solicitacao) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '700px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaTimes size={14} color="#64748b" />
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PistaCarousel images={fotosProcessadas} />
          
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1a237e', margin: '0 0 16px 0' }}>
              {solicitacao.nome || 'Pista sem nome'}
            </h2>
            
            <p style={{ color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.6' }}>
              {solicitacao.descricao || 'Sem descrição disponível'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaMapMarkerAlt size={18} color="#1a237e" />
                <span>
                  {solicitacao.rua && solicitacao.bairro 
                    ? `${solicitacao.rua} - ${solicitacao.bairro}`
                    : solicitacao.localizacao || 'Endereço não informado'
                  }
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>🛹</span>
                <span>Categoria: {solicitacao.categoria || 'Street'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaUser size={16} color="#1a237e" />
                <span>Solicitado por: {solicitacao.criadoPor || 'Usuário não informado'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={handleReject}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✗ Reprovar
              </button>
              <button
                onClick={handleApprove}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✓ Aprovar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitacaoPistaDetailsModal;